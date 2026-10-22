import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { ChevronLeft, EmojiEvents, MusicNote } from '@mui/icons-material'
import gameOverImage from 'assets/images/over.png'
import logoVnImage from 'assets/images/logo_vn.jpg'
import winImage from 'assets/images/win.png'
import { Link as RouterLink } from 'react-router'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import useWindowSize from 'hooks/useWindowSize'
import { useGameScoreboardStore } from 'lib/zustand/game-scoreboard-store'
import { useGameTemporaryScoreStore } from 'lib/zustand/game-temporary-score-store'
import { useThemeStore } from 'lib/zustand/theme-store'
import HomePageHeader from 'pages/home-page/sections/home-page-header'
import CharacterChooser from './character-chooser/character-chooser'
import GameScene from './game-scene/scene'
import GameSceneLoaderOverlay from './game-scene/game-scene-loader'
import MobileControlsOverlay from './game-scene/mobile-controls-overlay'
import ScoreboardPanel from './scoreboard-panel'
import SpotifyArtistPlayer from './spotify-artist-player'
import {
  CHARACTER_CONFIGS,
  DEVELOPMENT_MODE_CONFIG,
  DESKTOP_BREAKPOINT,
  DIFFICULTY_CONFIGS,
  GAME_POINTER_COLOR,
  MAX_HEALTH,
  START_RUN_COUNTDOWN_SECONDS,
  clampHealth,
  formatTimeLabel,
  type TCharacterId,
  type TGameStatus,
  type TPointerHitDirection,
  type TDifficultyLevel
} from './helpers'

const SPOTIFY_ARTIST_EMBED_URL =
  'https://open.spotify.com/embed/artist/3ygNOpBpgEmQsKBdcO68li?utm_source=generator&si=38260154709a4925'
const characterOptions = Object.keys(CHARACTER_CONFIGS) as TCharacterId[]

interface IJoystickVector {
  x: number
  y: number
}

const fightButtonPulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.38);
  }

  100% {
    transform: scale(1);
  }
`

const pointerHitMarkerFade = keyframes`
  0% {
    opacity: 0.95;
  }

  100% {
    opacity: 0;
  }
`

function GamePage() {
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const { height, width } = useWindowSize()
  const [selectedCharacter, setSelectedCharacter] = useState<TCharacterId>(
    characterOptions[0]
  )
  const [hasChosenCharacter, setHasChosenCharacter] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [difficulty, setDifficulty] = useState<TDifficultyLevel>('Noob')
  const [gameStatus, setGameStatus] = useState<TGameStatus>('menu')
  const [entryMode, setEntryMode] = useState<'normal' | 'dev'>('normal')
  const [health, setHealth] = useState(MAX_HEALTH)
  const [enemyHits, setEnemyHits] = useState(0)
  const [isSpotifyPlayerOpen, setIsSpotifyPlayerOpen] = useState(false)
  const [hasSpotifyPlayerOpened, setHasSpotifyPlayerOpened] = useState(false)
  const [remainingTime, setRemainingTime] = useState(
    DIFFICULTY_CONFIGS.Noob.roundTime
  )
  const [countdownSeconds, setCountdownSeconds] = useState(
    START_RUN_COUNTDOWN_SECONDS
  )
  const [cameraHorizontalSnapKey, setCameraHorizontalSnapKey] = useState(0)
  const [roundKey, setRoundKey] = useState(0)
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return true
    }

    return window.innerWidth >= DESKTOP_BREAKPOINT
  })
  const [isDeleteScoreboardDialogOpen, setIsDeleteScoreboardDialogOpen] =
    useState(false)
  const [mobileMoveVector, setMobileMoveVector] = useState<IJoystickVector>({
    x: 0,
    y: 0
  })
  const [mobileLookAccumulator, setMobileLookAccumulator] = useState({
    x: 0,
    y: 0
  })
  const [pointerHitDirection, setPointerHitDirection] =
    useState<TPointerHitDirection | null>(null)
  const [pointerHitPulseKey, setPointerHitPulseKey] = useState(0)
  const [mobileJumpPressCount, setMobileJumpPressCount] = useState(0)
  const [mobileShootPressCount, setMobileShootPressCount] = useState(0)

  const scoreboardEntries = useGameScoreboardStore(
    (state) => state.scoreboardEntries
  )
  const playerNameOptions = useGameScoreboardStore(
    (state) => state.playerNameOptions
  )
  const saveWonRun = useGameScoreboardStore((state) => state.saveWonRun)
  const resetScoreboard = useGameScoreboardStore(
    (state) => state.resetScoreboard
  )

  const pendingRun = useGameTemporaryScoreStore((state) => state.pendingRun)
  const clearPendingRun = useGameTemporaryScoreStore(
    (state) => state.clearPendingRun
  )
  const incrementEnemiesDefeated = useGameTemporaryScoreStore(
    (state) => state.incrementEnemiesDefeated
  )
  const setEnemiesDefeatedCount = useGameTemporaryScoreStore(
    (state) => state.setEnemiesDefeatedCount
  )
  const setPendingRun = useGameTemporaryScoreStore(
    (state) => state.setPendingRun
  )

  const isDesktop = width === undefined || width >= DESKTOP_BREAKPOINT
  const isMobileViewport = !isDesktop
  const isLandscapeMobile =
    !isMobileViewport ||
    width === undefined ||
    height === undefined ||
    width > height
  const isMobilePortrait = isMobileViewport && !isLandscapeMobile
  const viewportHeight = isMobileViewport ? '100svh' : '100dvh'
  const isCountingDown = gameStatus === 'countdown'
  const isPlaying = gameStatus === 'playing'
  const isRoundActive = isCountingDown || isPlaying
  const shouldShowCenterFightButton =
    hasChosenCharacter && gameStatus === 'menu'
  const isCameraOrbiting =
    gameStatus === 'menu' || gameStatus === 'won' || gameStatus === 'lost'
  const isResultDialogOpen =
    hasChosenCharacter && (gameStatus === 'won' || gameStatus === 'lost')
  const selectedCharacterConfig = CHARACTER_CONFIGS[selectedCharacter]
  const isDevelopmentMode = entryMode === 'dev'
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty]
  const effectiveDifficulty: TDifficultyLevel = isDevelopmentMode
    ? 'Hardcore'
    : difficulty
  const effectiveDifficultyConfig = isDevelopmentMode
    ? {
        ...DIFFICULTY_CONFIGS.Hardcore,
        enemyCount: DEVELOPMENT_MODE_CONFIG.enemyCount,
        enemyDamage: DEVELOPMENT_MODE_CONFIG.incomingDamage
      }
    : difficultyConfig
  const resultImageAlt =
    gameStatus === 'won' ? 'Victory result' : 'Game over result'
  const resultImageSource = gameStatus === 'won' ? winImage : gameOverImage
  const resultStatusLabel = gameStatus === 'won' ? 'WIN' : 'LOST'
  const resultStatusColor = gameStatus === 'won' ? '#6ec060' : '#ff5a4a'
  const trimmedPlayerName = playerName.trim()
  const shouldShowMobileControlsOverlay =
    isMobileViewport && isLandscapeMobile && isRoundActive
  const shouldDisableTouchSelection =
    isMobileViewport && isLandscapeMobile && isRoundActive

  const handleMobileMoveChange = (vector: IJoystickVector) => {
    setMobileMoveVector(vector)
  }

  const handleMobileLookDelta = (deltaX: number, deltaY: number) => {
    setMobileLookAccumulator((currentAccumulator) => ({
      x: currentAccumulator.x + deltaX,
      y: currentAccumulator.y + deltaY
    }))
  }

  const handleMobileJumpPress = () => {
    setMobileJumpPressCount((currentCount) => currentCount + 1)
  }

  const handleMobileShootPress = () => {
    setMobileShootPressCount((currentCount) => currentCount + 1)
  }

  const handlePlayerHitIndicator = (direction: TPointerHitDirection) => {
    setPointerHitDirection(direction)
    setPointerHitPulseKey((currentKey) => currentKey + 1)
  }

  const lockGamePointer = () => {
    if (isMobileViewport) {
      return
    }

    const gameCanvas = document.getElementById('game-scene-canvas')

    if (!(gameCanvas instanceof HTMLCanvasElement)) {
      return
    }

    if (document.pointerLockElement === gameCanvas) {
      return
    }

    if (typeof gameCanvas.requestPointerLock === 'function') {
      gameCanvas.requestPointerLock()
    }
  }

  const unlockGamePointer = () => {
    if (typeof document.exitPointerLock === 'function') {
      document.exitPointerLock()
    }
  }

  useEffect(() => {
    if (!(isMobileViewport && isLandscapeMobile)) {
      return undefined
    }

    const documentElement = document.documentElement
    const bodyElement = document.body
    const previousHtmlOverflow = documentElement.style.overflow
    const previousBodyOverflow = bodyElement.style.overflow

    documentElement.style.overflow = 'hidden'
    bodyElement.style.overflow = 'hidden'

    return () => {
      documentElement.style.overflow = previousHtmlOverflow
      bodyElement.style.overflow = previousBodyOverflow
    }
  }, [isLandscapeMobile, isMobileViewport])

  useEffect(() => {
    if (!shouldDisableTouchSelection) {
      return undefined
    }

    const documentElement = document.documentElement
    const bodyElement = document.body
    const previousHtmlUserSelect = documentElement.style.userSelect
    const previousBodyUserSelect = bodyElement.style.userSelect
    const previousHtmlWebkitUserSelect = documentElement.style.getPropertyValue(
      '-webkit-user-select'
    )
    const previousBodyWebkitUserSelect = bodyElement.style.getPropertyValue(
      '-webkit-user-select'
    )
    const previousHtmlWebkitTouchCallout =
      documentElement.style.getPropertyValue('-webkit-touch-callout')
    const previousBodyWebkitTouchCallout = bodyElement.style.getPropertyValue(
      '-webkit-touch-callout'
    )

    documentElement.style.userSelect = 'none'
    bodyElement.style.userSelect = 'none'
    documentElement.style.setProperty('-webkit-user-select', 'none')
    bodyElement.style.setProperty('-webkit-user-select', 'none')
    documentElement.style.setProperty('-webkit-touch-callout', 'none')
    bodyElement.style.setProperty('-webkit-touch-callout', 'none')

    return () => {
      documentElement.style.userSelect = previousHtmlUserSelect
      bodyElement.style.userSelect = previousBodyUserSelect
      documentElement.style.setProperty(
        '-webkit-user-select',
        previousHtmlWebkitUserSelect
      )
      bodyElement.style.setProperty(
        '-webkit-user-select',
        previousBodyWebkitUserSelect
      )
      documentElement.style.setProperty(
        '-webkit-touch-callout',
        previousHtmlWebkitTouchCallout
      )
      bodyElement.style.setProperty(
        '-webkit-touch-callout',
        previousBodyWebkitTouchCallout
      )
    }
  }, [shouldDisableTouchSelection])

  useEffect(() => {
    if (gameStatus === 'countdown' || gameStatus === 'playing') {
      return
    }

    unlockGamePointer()
  }, [gameStatus])

  useEffect(() => {
    if (gameStatus === 'won') {
      if (pendingRun) {
        saveWonRun({
          difficulty: pendingRun.difficulty,
          enemiesDefeated: pendingRun.enemiesDefeated,
          playerName: pendingRun.playerName
        })
      }

      clearPendingRun()
      return
    }

    if (gameStatus === 'lost') {
      clearPendingRun()
    }
  }, [clearPendingRun, gameStatus, pendingRun, saveWonRun])

  useEffect(() => {
    if (!isCountingDown) {
      return undefined
    }

    if (countdownSeconds <= 0) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setCountdownSeconds((currentCountdownSeconds) => {
        if (currentCountdownSeconds <= 1) {
          setGameStatus('playing')
          return 0
        }

        return currentCountdownSeconds - 1
      })
    }, 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [countdownSeconds, isCountingDown])

  useEffect(() => {
    if (!isPlaying || isDevelopmentMode) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setRemainingTime((currentRemainingTime) => {
        if (currentRemainingTime <= 1) {
          window.clearInterval(intervalId)
          setGameStatus('won')
          return 0
        }

        return currentRemainingTime - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isDevelopmentMode, isPlaying])

  const handleHealthChange = (nextHealth: number) => {
    const clampedHealth = clampHealth(nextHealth)
    setHealth(clampedHealth)

    if (clampedHealth === 0) {
      setGameStatus('lost')
    }
  }

  const startRound = () => {
    flushSync(() => {
      if (trimmedPlayerName.length > 0) {
        setPendingRun({ difficulty, playerName: trimmedPlayerName })
      }

      setHealth(MAX_HEALTH)
      setEnemyHits(0)
      setEnemiesDefeatedCount(0)
      setRemainingTime(isDevelopmentMode ? 0 : difficultyConfig.roundTime)
      setCountdownSeconds(START_RUN_COUNTDOWN_SECONDS)
      setRoundKey((currentRoundKey) => currentRoundKey + 1)
      setGameStatus('countdown')
    })

    lockGamePointer()
  }

  const handleStartGame = () => {
    if (isCountingDown || isMobilePortrait) {
      return
    }

    setCameraHorizontalSnapKey((currentSnapKey) => currentSnapKey + 1)
    startRound()
  }

  const handleDifficultyChange = (nextDifficulty: TDifficultyLevel) => {
    setDifficulty(nextDifficulty)

    if (!isDevelopmentMode) {
      setRemainingTime(DIFFICULTY_CONFIGS[nextDifficulty].roundTime)
    }
  }

  const handleReturnToMenu = () => {
    clearPendingRun()
    setGameStatus('menu')
    setHealth(MAX_HEALTH)
    setEnemyHits(0)
    setRemainingTime(isDevelopmentMode ? 0 : difficultyConfig.roundTime)
    setCountdownSeconds(START_RUN_COUNTDOWN_SECONDS)
    setRoundKey((currentRoundKey) => currentRoundKey + 1)
  }

  const handleChooseCharacter = () => {
    const normalizedPlayerName = playerName.trim()

    if (normalizedPlayerName.length === 0) {
      return
    }

    setPlayerName(normalizedPlayerName)
    setPendingRun({
      difficulty,
      playerName: normalizedPlayerName
    })
    setEntryMode('normal')
    setHasChosenCharacter(true)
    setRemainingTime(difficultyConfig.roundTime)
  }

  const handleChooseDevelopmentCharacter = () => {
    const normalizedPlayerName = playerName.trim()

    if (normalizedPlayerName.length === 0) {
      return
    }

    setPlayerName(normalizedPlayerName)
    setPendingRun({
      difficulty,
      playerName: normalizedPlayerName
    })
    setEntryMode('dev')
    setHasChosenCharacter(true)
    setRemainingTime(0)
  }

  const handleChooseDifferentCharacter = () => {
    handleReturnToMenu()
    setEntryMode('normal')
    setHasChosenCharacter(false)
  }

  const handleOpenScoreboard = () => {
    setIsScoreboardOpen(true)
  }

  const handleCloseScoreboard = () => {
    setIsScoreboardOpen(false)
  }

  const handleOpenDeleteScoreboardDialog = () => {
    setIsDeleteScoreboardDialogOpen(true)
  }

  const handleCloseDeleteScoreboardDialog = () => {
    setIsDeleteScoreboardDialogOpen(false)
  }

  const handleConfirmDeleteScoreboard = () => {
    resetScoreboard()
    setPlayerName('')
    setIsDeleteScoreboardDialogOpen(false)
  }

  const handleOpenSpotifyPlayer = () => {
    setHasSpotifyPlayerOpened(true)
    setIsSpotifyPlayerOpen(true)
  }

  const handleCloseSpotifyPlayer = () => {
    setIsSpotifyPlayerOpen(false)
  }

  return (
    <Box
      sx={{
        height: viewportHeight,
        minHeight: viewportHeight,
        maxHeight: viewportHeight,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default'
      }}
    >
      <HomePageHeader
        actionHref="/"
        actionLabel="Back to Portfolio"
        mobileLandscapeActionIcon={<ChevronLeft fontSize="small" />}
        mobileLandscapeActionAriaLabel="Back to Portfolio"
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          px: isMobileViewport ? 0 : { xs: 2, md: 3 },
          py: isMobileViewport ? 0 : { xs: 2, md: 3 }
        }}
      >
        {!isDesktop && isMobilePortrait ? (
          <Stack
            spacing={3}
            sx={{
              width: 'min(720px, 100%)',
              mx: 'auto',
              mt: 8,
              px: { xs: 4, md: 6 },
              py: { xs: 5, md: 6 },
              borderRadius: 1,
              border: isDarkMode
                ? '1px solid rgba(220, 229, 236, 0.12)'
                : '1px solid rgba(20, 32, 44, 0.12)',
              background: isDarkMode
                ? 'linear-gradient(160deg, rgba(23, 33, 43, 0.95) 0%, rgba(12, 17, 23, 0.86) 100%)'
                : 'linear-gradient(160deg, rgba(255, 255, 255, 0.95) 0%, rgba(234, 241, 245, 0.86) 100%)',
              boxShadow: isDarkMode
                ? '0 24px 70px rgba(0, 0, 0, 0.34)'
                : '0 24px 70px rgba(20, 32, 44, 0.14)'
            }}
          >
            <Typography variant="h4" sx={{ maxWidth: '12ch' }}>
              Rotate your phone to landscape to play
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Mobile controls are enabled in horizontal orientation only.
            </Typography>
          </Stack>
        ) : (
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              minHeight: 0,
              overflow: 'hidden',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              touchAction: 'none',
              borderRadius: isMobileViewport ? 0.5 : 3,
              border: isMobileViewport
                ? 'none'
                : isDarkMode
                  ? '1px solid rgba(220, 229, 236, 0.12)'
                  : '1px solid rgba(20, 32, 44, 0.12)',
              background: isDarkMode
                ? 'linear-gradient(180deg, rgba(23, 33, 43, 0.92) 0%, rgba(12, 17, 23, 0.96) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(231, 240, 236, 0.92) 100%)',
              boxShadow: isMobileViewport
                ? 'none'
                : isDarkMode
                  ? '0 30px 90px rgba(0, 0, 0, 0.35)'
                  : '0 30px 90px rgba(20, 32, 44, 0.18)'
            }}
          >
            <GameScene
              cameraHorizontalSnapKey={cameraHorizontalSnapKey}
              characterConfig={selectedCharacterConfig}
              difficultyConfig={effectiveDifficultyConfig}
              difficulty={effectiveDifficulty}
              health={health}
              isActive={isPlaying}
              isDevelopmentMode={isDevelopmentMode}
              isCameraOrbiting={isCameraOrbiting}
              isLandscapeMobile={isLandscapeMobile}
              isMobileViewport={isMobileViewport}
              mobileJumpPressCount={mobileJumpPressCount}
              mobileLookAccumulatorX={mobileLookAccumulator.x}
              mobileLookAccumulatorY={mobileLookAccumulator.y}
              mobileMoveVectorX={
                shouldShowMobileControlsOverlay ? mobileMoveVector.x : 0
              }
              mobileMoveVectorY={
                shouldShowMobileControlsOverlay ? mobileMoveVector.y : 0
              }
              mobileShootPressCount={mobileShootPressCount}
              showMobileControls={isRoundActive}
              onEnemyHit={() => {
                incrementEnemiesDefeated()
                setEnemyHits((currentEnemyHits) => currentEnemyHits + 1)
              }}
              onHealthChange={handleHealthChange}
              onPlayerHitIndicator={handlePlayerHitIndicator}
              playerName={playerName}
              roundKey={roundKey}
              showHealthMeter={hasChosenCharacter}
            />

            <GameSceneLoaderOverlay />

            {!hasChosenCharacter ? (
              <CharacterChooser
                availableCharacterIds={characterOptions}
                isLandscapeMobile={isLandscapeMobile}
                isMobileViewport={isMobileViewport}
                onCharacterChange={setSelectedCharacter}
                onDevChoose={handleChooseDevelopmentCharacter}
                onDifficultyChange={handleDifficultyChange}
                onPlayerNameChange={setPlayerName}
                onChoose={handleChooseCharacter}
                playerName={playerName}
                playerNameOptions={playerNameOptions}
                selectedCharacterConfig={selectedCharacterConfig}
                selectedDifficulty={difficulty}
              />
            ) : null}

            {hasChosenCharacter ? (
              <>
                <Box
                  aria-hidden="true"
                  data-testid="game-pointer"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 28,
                    height: 28,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    zIndex: 2,
                    '&::before, &::after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      backgroundColor: GAME_POINTER_COLOR,
                      boxShadow: isDarkMode
                        ? '0 0 16px rgba(84, 199, 184, 0.4)'
                        : '0 0 16px rgba(31, 138, 122, 0.25)'
                    },
                    '&::before': {
                      width: 2,
                      height: '100%',
                      transform: 'translate(-50%, -50%)'
                    },
                    '&::after': {
                      width: '100%',
                      height: 2,
                      transform: 'translate(-50%, -50%)'
                    }
                  }}
                />

                {pointerHitDirection ? (
                  <Box
                    aria-hidden="true"
                    data-testid={`pointer-hit-indicator-${pointerHitDirection}`}
                    key={`${pointerHitDirection}-${pointerHitPulseKey}`}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'none',
                      borderRadius: 999,
                      bgcolor: '#ff5a4a',
                      boxShadow: '0 0 14px rgba(255, 90, 74, 0.62)',
                      transform:
                        pointerHitDirection === 'right'
                          ? 'translate(18px, -50%)'
                          : pointerHitDirection === 'left'
                            ? 'translate(-26px, -50%)'
                            : pointerHitDirection === 'top'
                              ? 'translate(-50%, -26px)'
                              : 'translate(-50%, 18px)',
                      width:
                        pointerHitDirection === 'top' ||
                        pointerHitDirection === 'bottom'
                          ? 16
                          : 8,
                      height:
                        pointerHitDirection === 'top' ||
                        pointerHitDirection === 'bottom'
                          ? 8
                          : 16,
                      animation: `${pointerHitMarkerFade} 420ms ease-out forwards`
                    }}
                  />
                ) : null}

                {isMobileViewport ? (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: 10,
                      transform: 'translateX(-50%)',
                      zIndex: 12,
                      p: 0.6,
                      borderRadius: 999,
                      backdropFilter: 'blur(12px)',
                      backgroundColor: isDarkMode
                        ? 'rgba(12, 17, 23, 0.52)'
                        : 'rgba(243, 245, 248, 0.72)',
                      border: isDarkMode
                        ? '1px solid rgba(220, 229, 236, 0.2)'
                        : '1px solid rgba(20, 32, 44, 0.16)'
                    }}
                  >
                    <Chip
                      color="primary"
                      label={isDevelopmentMode ? '∞' : `${remainingTime}s`}
                      size="small"
                    />
                    <Chip
                      color="warning"
                      label={`Defeated: ${enemyHits}`}
                      size="small"
                    />
                  </Stack>
                ) : (
                  <Stack
                    spacing={2}
                    sx={{
                      position: 'absolute',
                      left: 24,
                      top: 24,
                      width: 360,
                      maxWidth: 'calc(100% - 48px)',
                      p: 3.25,
                      borderRadius: 2,
                      backdropFilter: 'blur(18px)',
                      backgroundColor: isDarkMode
                        ? 'rgba(12, 17, 23, 0.62)'
                        : 'rgba(243, 245, 248, 0.72)',
                      border: isDarkMode
                        ? '1px solid rgba(220, 229, 236, 0.12)'
                        : '1px solid rgba(20, 32, 44, 0.12)'
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: 'wrap' }}
                    >
                      <Chip
                        color="warning"
                        label={`Mode: ${isDevelopmentMode ? 'DEV' : difficultyConfig.label}`}
                      />
                      <Chip
                        color="primary"
                        label={selectedCharacterConfig.label}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{ color: 'text.secondary' }}
                          variant="body2"
                        >
                          Time left
                        </Typography>
                        <Typography variant="h3">
                          {isDevelopmentMode
                            ? '∞'
                            : formatTimeLabel(remainingTime)}
                        </Typography>
                      </Box>

                      <Box
                        component="img"
                        alt="VN logo"
                        src={logoVnImage}
                        sx={{
                          width: { xs: 84, sm: 112 },
                          height: { xs: 84, sm: 112 },
                          objectFit: 'contain',
                          borderRadius: 3,
                          alignSelf: 'center',
                          filter: isDarkMode
                            ? 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.28))'
                            : 'drop-shadow(0 10px 20px rgba(16, 24, 40, 0.14))'
                        }}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Typography
                        sx={{ color: 'text.secondary' }}
                        variant="body2"
                      >
                        Enemies defeated
                      </Typography>
                      <Chip
                        color="warning"
                        label={enemyHits}
                        variant="outlined"
                      />
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        color="primary"
                        disabled={!isRoundActive && gameStatus === 'menu'}
                        onClick={handleReturnToMenu}
                        variant="outlined"
                      >
                        STOP
                      </Button>
                      {shouldShowCenterFightButton ? (
                        <Button
                          color="secondary"
                          onClick={handleChooseDifferentCharacter}
                          variant="contained"
                        >
                          CHOOSE
                        </Button>
                      ) : null}
                    </Stack>
                  </Stack>
                )}

                {shouldShowCenterFightButton ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      zIndex: 3,
                      pointerEvents: 'auto',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Button
                      color="error"
                      onClick={handleStartGame}
                      sx={{
                        animation: `${fightButtonPulse} 1.8s ease-in-out infinite`,
                        px: 4,
                        py: 1.5,
                        transformOrigin: 'center'
                      }}
                      variant="contained"
                    >
                      Fight
                    </Button>
                  </Box>
                ) : null}
              </>
            ) : null}

            {shouldShowMobileControlsOverlay ? (
              <MobileControlsOverlay
                onJumpPress={handleMobileJumpPress}
                onLookDelta={handleMobileLookDelta}
                onMoveChange={handleMobileMoveChange}
                onShootPress={handleMobileShootPress}
              />
            ) : null}

            <Box
              sx={{
                position: 'absolute',
                right: 24,
                top: 24,
                zIndex: 8,
                pointerEvents: 'auto'
              }}
            >
              <ScoreboardPanel
                currentPlayerName={trimmedPlayerName}
                isDarkMode={isDarkMode}
                isVisible={isScoreboardOpen}
                onClose={handleCloseScoreboard}
                onDeleteClick={handleOpenDeleteScoreboardDialog}
                scoreboardEntries={scoreboardEntries}
              />

              {!isScoreboardOpen ? (
                isMobileViewport ? (
                  <IconButton
                    aria-label="Open scoreboard"
                    color="secondary"
                    onClick={handleOpenScoreboard}
                    sx={{
                      border: isDarkMode
                        ? '1px solid rgba(220, 229, 236, 0.32)'
                        : '1px solid rgba(20, 32, 44, 0.24)',
                      borderRadius: 2,
                      backgroundColor: isDarkMode
                        ? 'rgba(12, 17, 23, 0.62)'
                        : 'rgba(255, 255, 255, 0.72)'
                    }}
                  >
                    <EmojiEvents />
                  </IconButton>
                ) : (
                  <Button
                    color="secondary"
                    onClick={handleOpenScoreboard}
                    startIcon={<EmojiEvents />}
                    variant="contained"
                  >
                    Scoreboard
                  </Button>
                )
              ) : null}
            </Box>

            {!isMobileViewport ? (
              <Box
                sx={{
                  position: 'absolute',
                  left: 24,
                  bottom: 24,
                  zIndex: 2,
                  pointerEvents: 'auto'
                }}
              >
                {hasSpotifyPlayerOpened ? (
                  <SpotifyArtistPlayer
                    artistEmbedUrl={SPOTIFY_ARTIST_EMBED_URL}
                    isDarkMode={isDarkMode}
                    isVisible={isSpotifyPlayerOpen}
                    onClose={handleCloseSpotifyPlayer}
                  />
                ) : null}
                {!isSpotifyPlayerOpen ? (
                  <Button
                    color="secondary"
                    onClick={handleOpenSpotifyPlayer}
                    startIcon={<MusicNote />}
                    variant="contained"
                  >
                    Spotify
                  </Button>
                ) : null}
              </Box>
            ) : null}

            <Dialog
              fullWidth
              maxWidth="xs"
              onClose={handleCloseDeleteScoreboardDialog}
              open={isDeleteScoreboardDialogOpen}
            >
              <DialogContent>
                <Typography>Sure to delete data?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDeleteScoreboardDialog}>No</Button>
                <Button color="error" onClick={handleConfirmDeleteScoreboard}>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            {isCountingDown ? (
              <Stack
                spacing={1.5}
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  zIndex: 3,
                  minWidth: isMobileViewport ? 170 : 240,
                  px: isMobileViewport ? 2 : 4,
                  py: isMobileViewport ? 2 : 3.5,
                  textAlign: 'center',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: isMobileViewport ? 0.5 : 3,
                  backdropFilter: 'blur(18px)',
                  backgroundColor: isDarkMode
                    ? 'rgba(12, 17, 23, 0.72)'
                    : 'rgba(243, 245, 248, 0.8)',
                  border: isDarkMode
                    ? '1px solid rgba(220, 229, 236, 0.12)'
                    : '1px solid rgba(20, 32, 44, 0.12)',
                  boxShadow: isDarkMode
                    ? '0 30px 90px rgba(0, 0, 0, 0.3)'
                    : '0 30px 90px rgba(20, 32, 44, 0.16)'
                }}
              >
                <Typography
                  sx={{ color: 'secondary.main', letterSpacing: '0.16em' }}
                  variant={isMobileViewport ? 'caption' : 'body1'}
                >
                  PREPARE
                </Typography>
                <Typography variant={isMobileViewport ? 'h3' : 'h1'}>
                  {countdownSeconds}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    lineHeight: 1.6,
                    fontSize: isMobileViewport ? 12 : undefined
                  }}
                >
                  The run begins in two seconds. Get ready to move, aim, and
                  throw.
                </Typography>
              </Stack>
            ) : null}

            <Dialog
              fullWidth
              maxWidth={isMobileViewport ? false : 'xs'}
              open={isResultDialogOpen}
              sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: isMobileViewport ? 0.5 : 2,
                    p: isMobileViewport ? 0.7 : 1.5,
                    width: isMobileViewport
                      ? 'min(300px, calc(100% - 20px))'
                      : undefined,
                    m: isMobileViewport ? 1 : undefined,
                    background: isDarkMode
                      ? 'linear-gradient(180deg, rgba(23, 33, 43, 0.98) 0%, rgba(12, 17, 23, 0.98) 100%)'
                      : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(243, 245, 248, 0.98) 100%)',
                    border: isDarkMode
                      ? '1px solid rgba(220, 229, 236, 0.12)'
                      : '1px solid rgba(20, 32, 44, 0.12)',
                    boxShadow: isDarkMode
                      ? '0 30px 90px rgba(0, 0, 0, 0.35)'
                      : '0 30px 90px rgba(20, 32, 44, 0.18)'
                  }
                }
              }}
            >
              <Box sx={{ px: 2.5, pt: 2.5 }}>
                <Box
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: isMobileViewport ? 0.5 : 1.5
                  }}
                >
                  <Box
                    alt={resultImageAlt}
                    component="img"
                    src={resultImageSource}
                    sx={{
                      display: 'block',
                      width:
                        isMobileViewport && gameStatus === 'won'
                          ? '82%'
                          : '100%',
                      maxHeight:
                        isMobileViewport && gameStatus === 'won'
                          ? 140
                          : undefined,
                      mx:
                        isMobileViewport && gameStatus === 'won'
                          ? 'auto'
                          : undefined,
                      objectFit:
                        isMobileViewport && gameStatus === 'won'
                          ? 'contain'
                          : undefined,
                      height: 'auto'
                    }}
                  />
                  <Typography
                    variant={isMobileViewport ? 'h4' : 'h2'}
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '80%',
                      transform: 'translate(-50%, -50%)',
                      color: resultStatusColor,
                      fontWeight: 800,
                      letterSpacing: isMobileViewport ? '0.12em' : '0.18em',
                      textShadow: '0 10px 24px rgba(0, 0, 0, 0.55)',
                      textAlign: 'center',
                      backgroundColor: 'white',
                      borderRadius: isMobileViewport ? 0.5 : 1,
                      p: isMobileViewport ? 0.6 : 1,
                      fontSize: isMobileViewport ? 22 : undefined
                    }}
                  >
                    {resultStatusLabel}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    mt: 1.5,
                    px: 0.25
                  }}
                >
                  <Typography sx={{ color: 'text.secondary' }} variant="body2">
                    Enemies defeated
                  </Typography>
                  <Chip color="warning" label={enemyHits} variant="outlined" />
                </Stack>
              </Box>
              <DialogActions
                sx={{
                  px: isMobileViewport ? 1.25 : 2.5,
                  pb: isMobileViewport ? 1.25 : 2.5,
                  pt: isMobileViewport ? 1 : 2,
                  '& .MuiButton-root': {
                    minWidth: isMobileViewport ? 76 : undefined,
                    px: isMobileViewport ? 1 : undefined,
                    py: isMobileViewport ? 0.6 : undefined,
                    fontSize: isMobileViewport ? 11 : undefined
                  }
                }}
              >
                <Button
                  color="primary"
                  component={RouterLink}
                  to="/"
                  variant="outlined"
                >
                  Portfolio
                </Button>
                <Button
                  color="success"
                  onClick={handleChooseDifferentCharacter}
                  variant="contained"
                >
                  Change
                </Button>

                <Button
                  color="error"
                  onClick={handleStartGame}
                  variant="contained"
                >
                  Replay
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default GamePage
