import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

interface IHomePageHeader {
  actionHref: string
  actionLabel: string
  mobileActionLabel?: string
  mobileLandscapeActionIcon?: ReactNode
  mobileLandscapeActionAriaLabel?: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

function HomePageHeader({
  actionHref,
  actionLabel,
  mobileActionLabel,
  mobileLandscapeActionIcon,
  mobileLandscapeActionAriaLabel,
  isDarkMode,
  onToggleDarkMode
}: IHomePageHeader) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isMobileViewport = useMediaQuery('(max-width: 1023.95px)')
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const isMobileLandscape = isMobileViewport && isLandscape
  const visibleActionLabel =
    isMobile && mobileActionLabel ? mobileActionLabel : actionLabel
  const modeLabel = isDarkMode ? 'Dark mode' : 'Light mode'
  const shouldRenderMobileLandscapeActionIcon =
    isMobileLandscape && mobileLandscapeActionIcon !== undefined
  const actionAriaLabel = shouldRenderMobileLandscapeActionIcon
    ? (mobileLandscapeActionAriaLabel ?? actionLabel)
    : undefined

  return (
    <AppBar
      color="transparent"
      component="header"
      elevation={0}
      position="sticky"
      sx={{
        top: 0,
        py: 0,
        px: isMobileLandscape ? 1.5 : 0,
        zIndex: 10,
        backdropFilter: 'blur(18px)',
        backgroundColor: isDarkMode
          ? 'rgba(12, 17, 23, 0.4)'
          : 'rgba(243, 245, 248, 0.82)',
        borderBottom: isDarkMode
          ? '1px solid rgba(220, 229, 236, 0.08)'
          : '1px solid rgba(20, 32, 44, 0.12)'
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          width: {
            xs: isMobileLandscape ? '100%' : 'calc(100% - 24px)',
            sm: 'min(1200px, calc(100% - 40px))'
          },
          mx: isMobileLandscape ? 0 : 'auto',
          py: {
            xs: isMobileLandscape ? 0 : 1.25,
            sm: isMobileLandscape ? 0 : 1.5,
            md: isMobileLandscape ? 0 : 2
          },
          minHeight: isMobileLandscape ? '0 !important' : undefined,
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobileLandscape ? 'row' : 'column',
            alignItems: isMobileLandscape ? 'center' : 'flex-start',
            gap: isMobileLandscape ? 1 : 0
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: 'secondary.main', letterSpacing: '0.08em' }}
          >
            JANIS DREGERIS
          </Typography>
          <Typography
            variant={isMobileLandscape ? 'body2' : 'h1'}
            sx={{
              fontSize: isMobileLandscape
                ? '0.78rem'
                : { xs: '0.9rem', sm: '1rem' },
              lineHeight: 1.1,
              letterSpacing: isMobileLandscape ? '0.04em' : undefined,
              whiteSpace: 'nowrap'
            }}
          >
            FULL STACK ENGINEER
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Button
            color="secondary"
            component={RouterLink}
            to={actionHref}
            variant="outlined"
            aria-label={actionAriaLabel}
            sx={{
              borderColor: isDarkMode
                ? 'rgba(84, 199, 184, 0.42)'
                : 'rgba(31, 138, 122, 0.32)',
              borderRadius: '999px',
              px: 2.25,
              py: 1,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                borderColor: 'secondary.main',
                backgroundColor: isDarkMode
                  ? 'rgba(84, 199, 184, 0.08)'
                  : 'rgba(31, 138, 122, 0.08)'
              }
            }}
          >
            {shouldRenderMobileLandscapeActionIcon
              ? mobileLandscapeActionIcon
              : visibleActionLabel}
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                color="secondary"
                onChange={onToggleDarkMode}
              />
            }
            label={isMobile ? '' : modeLabel}
            labelPlacement="start"
            sx={{
              m: 0,
              gap: isMobile ? 0 : 1,
              '.MuiFormControlLabel-label': {
                color: 'text.secondary',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                whiteSpace: 'nowrap'
              }
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default HomePageHeader
