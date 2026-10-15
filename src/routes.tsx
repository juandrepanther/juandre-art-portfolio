import { Box, Stack, Typography } from '@mui/material'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import WebGL from './utils/WebGL'

const HomePage = lazy(() => import('./pages/home-page/home-page'))
const MazePage = lazy(() => import('./pages/Maze_Page/Maze_Page'))

function CanvasFallback() {
  return (
    <Stack
      spacing={2}
      sx={{
        minHeight: '100vh',
        px: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0c1117',
        color: '#dce5ec',
        textAlign: 'center'
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '2rem' }}>
        WebGL is not supported on your device.
      </Typography>
      <Typography sx={{ maxWidth: '42ch' }}>
        The Home route still works, but the Maze game requires canvas support to
        run correctly.
      </Typography>
    </Stack>
  )
}

const isWebGLSupported = WebGL.isWebGLAvailable() || WebGL.isWebGL2Available()

export function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <Suspense
            fallback={
              <Box sx={{ minHeight: '100vh', backgroundColor: '#0c1117' }} />
            }
          >
            <HomePage />
          </Suspense>
        }
        path="/"
      />
      <Route
        element={
          <Suspense
            fallback={
              <Box sx={{ minHeight: '100vh', backgroundColor: '#000' }} />
            }
          >
            {isWebGLSupported ? <MazePage /> : <CanvasFallback />}
          </Suspense>
        }
        path="/maze-game"
      />
    </Routes>
  )
}
