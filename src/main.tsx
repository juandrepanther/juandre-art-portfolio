import MobileVerticalMessage from './pages/Scene_Page/MobileVerticalMessage'
import React from 'react'
import './index.css'
import App from './App'
import { isMobile } from 'react-device-detect'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import Maze_Page from './pages/Maze_Page/Maze_Page'

const root = ReactDOM.createRoot(document.getElementById('root'))

const deviceWidth = window.innerWidth
const deviceHeight = window.innerHeight

//IMPORT utility to check webGL and WebGL2 compatibility

import WebGL from './utils/WebGL'
const WebGL_warning = 'WebGL is not supported on your device!'

//REDUX PROVIDER

import { Provider } from 'react-redux'
import { store } from './redux/store/store'

// ROUTES
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/juandre-art-portfolio/',
    element: <App />
  },
  {
    path: '/juandre-art-portfolio/maze-game/',
    element: <Maze_Page />
  }
])

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      {isMobile ? (
        <>
          {WebGL.isWebGLAvailable() || WebGL.isWebGL2Available() ? (
            <>
              {deviceWidth > deviceHeight ? (
                <RouterProvider router={router} />
              ) : (
                <MobileVerticalMessage />
              )}
            </>
          ) : (
            <div>{WebGL_warning}</div>
          )}
        </>
      ) : (
        <>
          {WebGL.isWebGLAvailable() || WebGL.isWebGL2Available() ? (
            <RouterProvider router={router} />
          ) : (
            <div>{WebGL_warning}</div>
          )}
        </>
      )}
    </Provider>
  </React.StrictMode>
)
