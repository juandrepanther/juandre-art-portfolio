import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import useWindowSize from 'hooks/useWindowSize'
import { useThemeStore } from 'lib/zustand/theme-store'
import HomePageHeader from 'pages/home-page/sections/home-page-header'
import GameScene from './game-scene'
import {
  DESKTOP_BREAKPOINT,
  DIFFICULTY_CONFIGS,
  MAX_HEALTH,
  START_RUN_COUNTDOWN_SECONDS,
  SURVIVAL_TIME_SECONDS,
  clampHealth,
  formatTimeLabel,
  type TGameStatus,
  type TDifficultyLevel
} from './helpers'

function GamePage() {
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const { width } = useWindowSize()
  const [difficulty, setDifficulty] = useState<TDifficultyLevel>('Easy')
  const [gameStatus, setGameStatus] = useState<TGameStatus>('menu')
  const [health, setHealth] = useState(MAX_HEALTH)
  const [monkeyHits, setMonkeyHits] = useState(0)
  const [remainingTime, setRemainingTime] = useState(SURVIVAL_TIME_SECONDS)
  const [countdownSeconds, setCountdownSeconds] = useState(
    START_RUN_COUNTDOWN_SECONDS
  )
  const [roundKey, setRoundKey] = useState(0)

  const isDesktop = width === undefined || width >= DESKTOP_BREAKPOINT
  const isCountingDown = gameStatus === 'countdown'
  const isPlaying = gameStatus === 'playing'
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty]

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

  const handleStartGame = () => {
    setHealth(MAX_HEALTH)
    setMonkeyHits(0)
    setRemainingTime(SURVIVAL_TIME_SECONDS)
    setCountdownSeconds(START_RUN_COUNTDOWN_SECONDS)
    setRoundKey((currentRoundKey) => currentRoundKey + 1)
    setGameStatus('countdown')
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
              borderRadius: 6,
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
            <Typography
              sx={{ color: 'secondary.main', letterSpacing: '0.16em' }}
            >
              DESKTOP EXPERIENCE
            </Typography>
            <Typography variant="h2" sx={{ maxWidth: '12ch' }}>
              Banana Run is tuned for desktop controls only.
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              Open this route on a desktop-sized viewport to play the
              third-person survival mode with smooth camera movement,
              shader-driven characters, and arena combat.
            </Typography>
          </Stack>
        ) : (
          <Box
            sx={{
              position: 'relative',
              height: 'calc(100vh - 112px)',
              minHeight: 'calc(100vh - 112px)',
              overflow: 'hidden',
              borderRadius: 6,
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
              difficulty={difficulty}
              isActive={isPlaying}
              onHealthChange={handleHealthChange}
              onMonkeyHit={() =>
                setMonkeyHits((currentMonkeyHits) => currentMonkeyHits + 1)
              }
              roundKey={roundKey}
            />

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
                  backgroundColor: isDarkMode
                    ? 'rgba(244, 252, 248, 0.9)'
                    : 'rgba(20, 32, 44, 0.82)',
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
                borderRadius: 4,
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
                  color="secondary"
                  label={`Mode: ${difficultyConfig.label}`}
                />
                <Chip
                  label={
                    gameStatus === 'playing'
                      ? 'Survive the monkey rain'
                      : gameStatus === 'countdown'
                        ? `Run starts in ${countdownSeconds}`
                        : gameStatus === 'won'
                          ? 'You survived the minute'
                          : gameStatus === 'lost'
                            ? 'The troop got you'
                            : 'Choose a difficulty'
                  }
                  variant="outlined"
                />
              </Stack>

              <Box>
                <Stack
                  direction="row"
                  sx={{ justifyContent: 'space-between', mb: 1 }}
                >
                  <Typography variant="body2">Health</Typography>
                  <Typography variant="body2">{health}%</Typography>
                </Stack>
                <LinearProgress
                  color={health > 40 ? 'secondary' : 'primary'}
                  value={health}
                  variant="determinate"
                  sx={{
                    height: 12,
                    borderRadius: '999px',
                    backgroundColor: isDarkMode
                      ? 'rgba(220, 229, 236, 0.14)'
                      : 'rgba(20, 32, 44, 0.12)'
                  }}
                />
              </Box>

              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ color: 'text.secondary' }} variant="body2">
                    Time left
                  </Typography>
                  <Typography variant="h3">
                    {formatTimeLabel(remainingTime)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ color: 'text.secondary' }} variant="body2">
                    Monkey speed
                  </Typography>
                  <Typography variant="h5">
                    {difficultyConfig.bananaSpeed.toFixed(0)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography sx={{ color: 'text.secondary' }} variant="body2">
                  Monkey hits
                </Typography>
                <Typography variant="h5">{monkeyHits}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {(Object.keys(DIFFICULTY_CONFIGS) as TDifficultyLevel[]).map(
                  (difficultyOption) => (
                    <Button
                      key={difficultyOption}
                      color="secondary"
                      disabled={isPlaying || isCountingDown}
                      onClick={() => setDifficulty(difficultyOption)}
                      variant={
                        difficultyOption === difficulty
                          ? 'contained'
                          : 'outlined'
                      }
                    >
                      {difficultyOption}
                    </Button>
                  )
                )}
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Button
                  color="secondary"
                  onClick={handleStartGame}
                  variant="contained"
                >
                  {isPlaying || isCountingDown ? 'Restart Run' : 'Start Run'}
                </Button>
                <Button
                  color="primary"
                  disabled={
                    !isPlaying && !isCountingDown && gameStatus === 'menu'
                  }
                  onClick={() => {
                    setGameStatus('menu')
                    setHealth(MAX_HEALTH)
                    setMonkeyHits(0)
                    setRemainingTime(SURVIVAL_TIME_SECONDS)
                    setCountdownSeconds(START_RUN_COUNTDOWN_SECONDS)
                    setRoundKey((currentRoundKey) => currentRoundKey + 1)
                  }}
                  variant="outlined"
                >
                  Reset
                </Button>
              </Stack>
            </Stack>

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
                  borderRadius: 5,
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

            {gameStatus !== 'playing' &&
            gameStatus !== 'lost' &&
            !isCountingDown ? (
              <Stack
                spacing={2.5}
                sx={{
                  position: 'absolute',
                  right: 24,
                  bottom: 24,
                  width: 420,
                  maxWidth: 'calc(100% - 48px)',
                  p: 5,
                  borderRadius: 5,
                  backdropFilter: 'blur(18px)',
                  backgroundColor: isDarkMode
                    ? 'rgba(12, 17, 23, 0.58)'
                    : 'rgba(255, 255, 255, 0.72)',
                  border: isDarkMode
                    ? '1px solid rgba(220, 229, 236, 0.12)'
                    : '1px solid rgba(20, 32, 44, 0.12)'
                }}
              >
                <Typography
                  sx={{ color: 'secondary.main', letterSpacing: '0.14em' }}
                >
                  THIRD PERSON SURVIVAL
                </Typography>
                <Typography variant="h2" sx={{ maxWidth: '12ch' }}>
                  {gameStatus === 'won'
                    ? 'You lasted the full minute.'
                    : 'Hold the grove for sixty seconds.'}
                </Typography>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                  Monkeys fire bananas with a slight aiming variance, hearts
                  appear randomly near the trees, heal +20%, and each hit
                  removes 5% health. Easy starts slow, Survivor is relentless.
                </Typography>
              </Stack>
            ) : null}

            <Dialog
              fullWidth
              maxWidth="xs"
              open={gameStatus === 'lost'}
              slotProps={{
                paper: {
                  sx: {
                    borderRadius: 5,
                    p: 1,
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
              <DialogTitle sx={{ px: 4, pt: 4, pb: 1.5 }}>
                GAME OVER
              </DialogTitle>
              <DialogContent sx={{ px: 4, pb: 1.5 }}>
                <Stack spacing={1.5}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    The monkeys drained your health to 0%.
                  </Typography>
                  <Typography variant="body2">
                    Monkey hits landed: {monkeyHits}
                  </Typography>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ px: 4, pb: 4, pt: 1 }}>
                <Button
                  color="secondary"
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
