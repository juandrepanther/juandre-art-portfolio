import { keyframes } from '@emotion/react'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import useReducedMotion from '../hooks/use-reduced-motion'

const loaderLabels = [
  'Preparing gallery atmosphere',
  'Warming shader layers',
  'Composing portfolio route',
  'Balancing glass reflections'
]

const progressStops = [18, 34, 52, 71, 88, 94]

const haloDrift = keyframes`
  0% {
    transform: translate3d(-3%, -2%, 0) scale(1);
  }
  50% {
    transform: translate3d(3%, 2%, 0) scale(1.08);
  }
  100% {
    transform: translate3d(-2%, 1%, 0) scale(0.98);
  }
`

const cardFloat = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -10px, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`

const beamSweep = keyframes`
  0% {
    transform: translate3d(-120%, 0, 0);
  }
  100% {
    transform: translate3d(220%, 0, 0);
  }
`

function ImmersivePageLoader() {
  const theme = useTheme()
  const isReducedMotion = useReducedMotion()
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    if (isReducedMotion) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setPhaseIndex((currentPhaseIndex) => currentPhaseIndex + 1)
    }, 520)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isReducedMotion])

  const loaderLabel = loaderLabels[phaseIndex % loaderLabels.length]
  const progressValue = isReducedMotion
    ? 32
    : progressStops[Math.min(phaseIndex, progressStops.length - 1)]

  return (
    <Box
      aria-busy="true"
      aria-live="polite"
      role="status"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        px: 3,
        py: 6,
        background: `radial-gradient(circle at 18% 18%, ${alpha(theme.palette.secondary.main, 0.2)}, transparent 0 28%), radial-gradient(circle at 82% 22%, ${alpha(theme.palette.primary.main, 0.16)}, transparent 0 24%), linear-gradient(160deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.background.paper, 0.94)} 52%, ${theme.palette.background.default} 100%)`
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: '-12%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 56%), radial-gradient(circle at 70% 30%, ${alpha(theme.palette.primary.main, 0.18)} 0%, transparent 42%)`,
          filter: 'blur(24px)',
          animation: isReducedMotion
            ? 'none'
            : `${haloDrift} 6.2s ease-in-out infinite`
        }}
      />

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${alpha(theme.palette.common.white, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.common.white, 0.04)} 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          maskImage:
            'radial-gradient(circle at center, black 38%, transparent 82%)',
          opacity: 0.35
        }}
      />

      <Stack
        spacing={3}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 'min(540px, 100%)',
          p: { xs: 3, md: 4 },
          borderRadius: '32px',
          border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.36),
          backdropFilter: 'blur(22px)',
          boxShadow: `0 32px 90px ${alpha(theme.palette.common.black, 0.28)}`,
          animation: isReducedMotion
            ? 'none'
            : `${cardFloat} 4.2s ease-in-out infinite`
        }}
      >
        <Stack spacing={1.5}>
          <Typography
            sx={{
              color: 'secondary.main',
              fontSize: '0.8rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase'
            }}
          >
            Janis Dregeris
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.6rem' },
              lineHeight: 0.92,
              maxWidth: '10ch'
            }}
          >
            Entering the portfolio.
          </Typography>
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {loaderLabel}
          </Typography>
        </Stack>

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '999px',
            p: 0.75,
            backgroundColor: alpha(theme.palette.common.white, 0.05)
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(110deg, transparent 0%, ${alpha(theme.palette.common.white, 0.18)} 50%, transparent 100%)`,
              animation: isReducedMotion
                ? 'none'
                : `${beamSweep} 1.8s linear infinite`
            }}
          />
          <LinearProgress
            value={progressValue}
            variant="determinate"
            sx={{
              height: 10,
              borderRadius: '999px',
              backgroundColor: alpha(theme.palette.common.white, 0.06),
              '& .MuiLinearProgress-bar': {
                borderRadius: '999px',
                background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
              }
            }}
          />
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ justifyContent: 'space-between', color: 'text.secondary' }}
        >
          <Typography sx={{ fontSize: '0.95rem' }}>
            Visual system boot sequence in progress
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', color: 'text.primary' }}>
            {progressValue}%
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ImmersivePageLoader
