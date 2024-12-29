import React from 'react'
import App from './App'
import Maze_Page from './pages/Maze_Page/Maze_Page'
import Features_Page from './pages/Features_Page/Features_Page'
import { createBrowserRouter } from 'react-router-dom'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/maze-game/',
    element: <Maze_Page />
  },
  {
    path: '/features/',
    element: <Features_Page />
  }
])
