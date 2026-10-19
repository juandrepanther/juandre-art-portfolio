import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Toolbar,
  Typography
} from '@mui/material'
import { Link as RouterLink } from 'react-router'

interface IHomePageHeader {
  actionHref: string
  actionLabel: string
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

function HomePageHeader({
  actionHref,
  actionLabel,
  isDarkMode,
  onToggleDarkMode
}: IHomePageHeader) {
  return (
    <AppBar
      color="transparent"
      component="header"
      elevation={0}
      position="sticky"
      sx={{
        top: 0,
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
            xs: 'calc(100% - 24px)',
            sm: 'min(1200px, calc(100% - 40px))'
          },
          mx: 'auto',
          py: { xs: 1.25, sm: 1.5, md: 2 },
          minHeight: 'unset',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{ color: 'secondary.main', letterSpacing: '0.08em' }}
          >
            JANIS DREGERIS
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, lineHeight: 1.1 }}
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
            {actionLabel}
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                color="secondary"
                onChange={onToggleDarkMode}
              />
            }
            label={isDarkMode ? 'Dark mode' : 'Light mode'}
            labelPlacement="start"
            sx={{
              m: 0,
              gap: 1,
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
