import {
  AppBar,
  Box,
  FormControlLabel,
  Stack,
  Switch,
  Toolbar,
  Typography
} from '@mui/material'

interface IHomePageHeader {
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

function HomePageHeader({ isDarkMode, onToggleDarkMode }: IHomePageHeader) {
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
          width: 'min(1200px, calc(100% - 32px))',
          mx: 'auto',
          py: 2,
          minHeight: 'unset',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ color: 'secondary.main' }}>
            JANIS DREGERIS
          </Typography>
          <Typography variant="h1" sx={{ fontSize: '1rem' }}>
            FULL STACK ENGINEER
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                color="secondary"
                inputProps={{ 'aria-label': 'toggle dark mode' }}
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
                fontSize: '0.875rem'
              }
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default HomePageHeader
