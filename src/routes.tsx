import { Box } from '@mui/material'
import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router'

const HomePage = lazy(() => import('./pages/home-page/home-page'))
const ErrorPage = lazy(() => import('./pages/error-page/error-page'))

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
              <Box sx={{ minHeight: '100vh', backgroundColor: '#0c1117' }} />
            }
          >
            <ErrorPage />
          </Suspense>
        }
        path="*"
      />
    </Routes>
  )
}
