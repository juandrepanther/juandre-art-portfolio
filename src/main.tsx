import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { Provider } from 'react-redux'
import { store } from './redux/store/store'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes'

const root = ReactDOM.createRoot(document.getElementById('root'))

//utility to check webGL and WebGL2 compatibility

import WebGL from './utils/WebGL'
const WebGL_warning = 'WebGL is not supported on your device!'

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CssBaseline />
      {WebGL.isWebGLAvailable() || WebGL.isWebGL2Available() ? (
        <RouterProvider router={routes} />
      ) : (
        <div>{WebGL_warning}</div>
      )}
    </Provider>
  </React.StrictMode>
)
