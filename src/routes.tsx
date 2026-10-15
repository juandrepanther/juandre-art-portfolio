import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router'
import ImmersivePageLoader from 'shared/immersive-page-loader'

const HomePage = lazy(() => import('pages/home-page/home-page'))
const ErrorPage = lazy(() => import('pages/error-page/error-page'))

export function AppRoutes() {
  return (
    <Suspense fallback={<ImmersivePageLoader />}>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ErrorPage />} path="*" />
      </Routes>
    </Suspense>
  )
}
