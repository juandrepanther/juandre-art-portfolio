import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography
} from '@mui/material'
import { keyframes } from '@mui/material/styles'
import { EmojiEvents, MusicNote } from '@mui/icons-material'
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
import ScoreboardPanel from './scoreboard-panel'
import SpotifyArtistPlayer from './spotify-artist-player'
import {
  CHARACTER_CONFIGS,
  DESKTOP_BREAKPOINT,
  DIFFICULTY_CONFIGS,
  GAME_POINTER_COLOR,
  MAX_HEALTH,
  START_RUN_COUNTDOWN_SECONDS,
  clampHealth,
  formatTimeLabel,
  type TCharacterId,
  type TGameStatus,
  type TDifficultyLevel
} from './helpers'

const SPOTIFY_ARTIST_EMBED_URL =
  'https://open.spotify.com/embed/artist/3ygNOpBpgEmQsKBdcO68li?utm_source=generator&si=38260154709a4925'
const characterOptions = Object.keys(CHARACTER_CONFIGS) as TCharacterId[]
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

function GamePage() {
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const { width } = useWindowSize()
  const [selectedCharacter, setSelectedCharacter] = useState<TCharacterId>(
    characterOptions[0]
  )
  const [hasChosenCharacter, setHasChosenCharacter] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [difficulty, setDifficulty] = useState<TDifficultyLevel>('Noob')
  const [gameStatus, setGameStatus] = useState<TGameStatus>('menu')
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
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(true)
  const [isDeleteScoreboardDialogOpen, setIsDeleteScoreboardDialogOpen] =
    useState(false)

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
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty]
  const resultImageAlt =
    gameStatus === 'won' ? 'Victory result' : 'Game over result'
  const resultImageSource = gameStatus === 'won' ? winImage : gameOverImage
  const resultStatusLabel = gameStatus === 'won' ? 'WIN' : 'LOST'
  const resultStatusColor = gameStatus === 'won' ? '#6ec060' : '#ff5a4a'
  const trimmedPlayerName = playerName.trim()

  const lockGamePointer = () => {
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
    if (!isPlaying) {
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
  }, [isPlaying])

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
      setRemainingTime(difficultyConfig.roundTime)
      setCountdownSeconds(START_RUN_COUNTDOWN_SECONDS)
      setRoundKey((currentRoundKey) => currentRoundKey + 1)
      setGameStatus('countdown')
    })

    lockGamePointer()
  }

  const handleStartGame = () => {
    if (isCountingDown) {
      return
    }

    setCameraHorizontalSnapKey((currentSnapKey) => currentSnapKey + 1)
    startRound()
  }

  const handleDifficultyChange = (nextDifficulty: TDifficultyLevel) => {
    setDifficulty(nextDifficulty)
    setRemainingTime(DIFFICULTY_CONFIGS[nextDifficulty].roundTime)
  }

  const handleReturnToMenu = () => {
    clearPendingRun()
    setGameStatus('menu')
    setHealth(MAX_HEALTH)
    setEnemyHits(0)
    setRemainingTime(difficultyConfig.roundTime)
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
    setHasChosenCharacter(true)
    setRemainingTime(difficultyConfig.roundTime)
  }

  const handleChooseDifferentCharacter = () => {
    handleReturnToMenu()
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <HomePageHeader
        actionHref="/"
        actionLabel="Back to Portfolio"
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 88px)',
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 }
        }}
      >
        {!isDesktop ? (
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
              Varang Kill is tuned for desktop controls only
            </Typography>
          </Stack>
        ) : (
          <Box
            sx={{
              position: 'relative',
              height: 'calc(100vh - 112px)',
              minHeight: 'calc(100vh - 112px)',
              overflow: 'hidden',
              borderRadius: 3,
              border: isDarkMode
                ? '1px solid rgba(220, 229, 236, 0.12)'
                : '1px solid rgba(20, 32, 44, 0.12)',
              background: isDarkMode
                ? 'linear-gradient(180deg, rgba(23, 33, 43, 0.92) 0%, rgba(12, 17, 23, 0.96) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(231, 240, 236, 0.92) 100%)',
              boxShadow: isDarkMode
                ? '0 30px 90px rgba(0, 0, 0, 0.35)'
                : '0 30px 90px rgba(20, 32, 44, 0.18)'
            }}
          >
            <GameScene
              cameraHorizontalSnapKey={cameraHorizontalSnapKey}
              characterConfig={selectedCharacterConfig}
              difficultyConfig={difficultyConfig}
              difficulty={difficulty}
              health={health}
              isActive={isPlaying}
              isCameraOrbiting={isCameraOrbiting}
              onEnemyHit={() => {
                incrementEnemiesDefeated()
                setEnemyHits((currentEnemyHits) => currentEnemyHits + 1)
              }}
              onHealthChange={handleHealthChange}
              playerName={playerName}
              roundKey={roundKey}
              showHealthMeter={hasChosenCharacter}
            />

            <GameSceneLoaderOverlay />

            {!hasChosenCharacter ? (
              <CharacterChooser
                availableCharacterIds={characterOptions}
                onCharacterChange={setSelectedCharacter}
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
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Chip
                      color="warning"
                      label={`Mode: ${difficultyConfig.label}`}
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
                        {formatTimeLabel(remainingTime)}
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
                <Button
                  color="secondary"
                  onClick={handleOpenScoreboard}
                  startIcon={<EmojiEvents />}
                  variant="contained"
                >
                  Scoreboard
                </Button>
              ) : null}
            </Box>

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
                  minWidth: 240,
                  px: 4,
                  py: 3.5,
                  textAlign: 'center',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: 3,
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
                >
                  PREPARE
                </Typography>
                <Typography variant="h1">{countdownSeconds}</Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  The run begins in two seconds. Get ready to move, aim, and
                  throw.
                </Typography>
              </Stack>
            ) : null}

            <Dialog
              fullWidth
              maxWidth="xs"
              open={isResultDialogOpen}
              sx={{ zIndex: (theme) => theme.zIndex.tooltip + 1 }}
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: 2,
                    p: 1.5,
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
                    borderRadius: 1.5
                  }}
                >
                  <Box
                    alt={resultImageAlt}
                    component="img"
                    src={resultImageSource}
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto'
                    }}
                  />
                  <Typography
                    variant="h2"
                    sx={{
                      position: 'absolute',
                      left: '50%',
                      top: '80%',
                      transform: 'translate(-50%, -50%)',
                      color: resultStatusColor,
                      fontWeight: 800,
                      letterSpacing: '0.18em',
                      textShadow: '0 10px 24px rgba(0, 0, 0, 0.55)',
                      textAlign: 'center',
                      backgroundColor: 'white',
                      borderRadius: 1,
                      p: 1
                    }}
                  >
                    {resultStatusLabel}
                  </Typography>
                </Box>
              </Box>
              <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 2 }}>
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
