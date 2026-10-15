import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import { Prism, Shader } from 'shaders/react'

function ErrorPage() {
  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
        px: 3,
        background:
          'radial-gradient(circle at top, rgba(84, 199, 184, 0.16), transparent 34%), linear-gradient(180deg, #0c1117 0%, #101824 42%, #0c1117 100%)'
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none'
        }}
      >
        <Shader className="shader-fill">
          <Prism intensity={1.6} />
        </Shader>
      </Box>

      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 20% 20%, rgba(217, 139, 79, 0.16), transparent 0 20%), radial-gradient(circle at 80% 35%, rgba(84, 199, 184, 0.18), transparent 0 22%), radial-gradient(circle at 55% 78%, rgba(220, 229, 236, 0.08), transparent 0 24%)',
          filter: 'blur(18px)'
        }}
      />

      <Stack
        spacing={3}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: 'min(720px, 100%)',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Chip
          label="404 • route unavailable"
          sx={{
            borderRadius: '999px',
            color: 'secondary.main',
            backgroundColor: 'rgba(84, 199, 184, 0.08)',
            border: '1px solid rgba(84, 199, 184, 0.18)'
          }}
        />
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: 180, md: 260 },
            height: { xs: 180, md: 260 }
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 30% 30%, rgba(84, 199, 184, 0.45), rgba(84, 199, 184, 0.06) 46%, transparent 70%)',
              filter: 'blur(1px)'
            }}
          />
          <Typography
            sx={{
              position: 'relative',
              zIndex: 1,
              fontSize: { xs: '5rem', md: '7rem' },
              fontWeight: 800,
              letterSpacing: '-0.08em',
              textShadow: '0 0 28px rgba(84, 199, 184, 0.25)',
              color: 'black'
            }}
          >
            404
          </Typography>
        </Box>

        <Stack spacing={1.5} sx={{ maxWidth: '52ch' }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
          >
            This page drifted out of orbit.
          </Typography>
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            The route you tried to open does not exist. Return to the portfolio
            home page to keep exploring the work, visuals, and contact details.
          </Typography>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button component="a" href="/" variant="contained">
            Back to home
          </Button>
          <Button color="secondary" component="a" href="/" variant="text">
            Recover route
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export default ErrorPage
