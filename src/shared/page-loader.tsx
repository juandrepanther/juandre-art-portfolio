import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

function ImmersivePageLoader() {
  const theme = useTheme()

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
          filter: 'blur(24px)'
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
          boxShadow: `0 32px 90px ${alpha(theme.palette.common.black, 0.28)}`
        }}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary'
          }}
        >
          <CircularProgress
            color="secondary"
            size={72}
            thickness={4}
            sx={{
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }}
          />
          <Typography sx={{ fontSize: '0.95rem' }}>
            Loading portfolio assets
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ImmersivePageLoader
