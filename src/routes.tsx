import { lazy, Suspense } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'

const MazePage = lazy(() => import('./pages/Maze_Page/Maze_Page'))

const mazePage = (
  <Suspense fallback={null}>
    <MazePage />
  </Suspense>
)

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/maze-game/" replace />
  },
  {
    path: '/maze-game/',
    element: mazePage
  },
  {
    path: '/features/',
    element: <Navigate to="/maze-game/" replace />
  }
])
