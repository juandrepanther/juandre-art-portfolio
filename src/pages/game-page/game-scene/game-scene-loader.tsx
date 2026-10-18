import { useProgress } from '@react-three/drei'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

function getLoadingItemLabel(item: string | undefined) {
  if (!item) {
    return 'Loading arena assets'
  }

  const itemName = item.split('/').pop()?.split('?')[0]

  if (!itemName) {
    return 'Loading arena assets'
  }

  return `Loading ${itemName}`
}

function GameSceneLoaderOverlay() {
  const theme = useTheme()
  const { active, loaded, total, progress, item } = useProgress()

  if (!active) {
    return null
  }

  const loadingProgress = Math.max(0, Math.min(100, progress))
  const loadedLabel =
    total > 0 ? `${loaded} of ${total} assets ready` : 'Preparing the arena'

  return (
    <Box
      aria-busy="true"
      aria-live="polite"
      role="status"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 6,
        display: 'grid',
        placeItems: 'center',
        px: 3,
        py: 4,
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.86)} 0%, ${alpha(theme.palette.background.paper, 0.94)} 100%)`,
        backdropFilter: 'blur(16px)'
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          width: 'min(460px, 100%)',
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.45),
          boxShadow: `0 24px 80px ${alpha(theme.palette.common.black, 0.28)}`
        }}
      >
        <Stack spacing={1}>
          <Typography sx={{ color: 'secondary.main', letterSpacing: '0.18em' }}>
            LOADING GAME
          </Typography>
          <Typography variant="h2" sx={{ maxWidth: '12ch' }}>
            Preparing the battlefield.
          </Typography>
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            {getLoadingItemLabel(item)}
          </Typography>
        </Stack>

        <Stack spacing={1.25}>
          <Box
            sx={{
              overflow: 'hidden',
              borderRadius: '999px',
              backgroundColor: alpha(theme.palette.common.white, 0.08)
            }}
          >
            <LinearProgress
              aria-label="Game loading progress"
              color="secondary"
              value={loadingProgress}
              variant="determinate"
              sx={{
                height: 12,
                borderRadius: '999px',
                backgroundColor: 'transparent',
                '& .MuiLinearProgress-bar': {
                  borderRadius: '999px',
                  background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
                }
              }}
            />
          </Box>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography sx={{ color: 'text.secondary' }} variant="body2">
              {loadedLabel}
            </Typography>
            <Typography variant="body2">
              {Math.round(loadingProgress)}%
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default GameSceneLoaderOverlay
