import { Box, Button, Stack, Typography } from '@mui/material'

function WebglNotSupportedPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 3,
        py: 4,
        textAlign: 'center',
        background:
          'linear-gradient(180deg, rgba(12, 17, 23, 1) 0%, rgba(16, 24, 36, 1) 55%, rgba(12, 17, 23, 1) 100%)',
        color: '#ffffff'
      }}
    >
      <Stack spacing={2.5} sx={{ width: 'min(680px, 100%)' }}>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.72)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontSize: { xs: '0.76rem', md: '0.82rem' }
          }}
        >
          Compatibility notice
        </Typography>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: '1.8rem', md: '2.6rem' }, fontWeight: 700 }}
        >
          This browser cannot render WebGL scenes.
        </Typography>
        <Typography
          sx={{ color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.7 }}
        >
          This portfolio relies on hardware-accelerated graphics. Try opening it
          in a modern browser with WebGL enabled, or use a different device.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ justifyContent: 'center' }}
        >
          <Button component="a" href="/" variant="contained">
            Go to home
          </Button>
          <Button onClick={() => window.location.reload()} variant="outlined">
            Retry
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default WebglNotSupportedPage
