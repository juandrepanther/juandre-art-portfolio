import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { BrowserRouter } from 'react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createAppTheme } from 'lib/mui/app-theme'
import { useThemeStore } from 'lib/zustand/theme-store'
import WebglNotSupportedPage from 'pages/webgl-not-supported-page/webgl-not-supported-page'
import { isWebGLSupported } from 'utils/webgl-support'
import { AppRoutes } from './routes'
import './index.css'

const rootNode = document.getElementById('root')

if (!rootNode) {
  throw new Error('Root element was not found.')
}

const root = createRoot(rootNode)

function AppRoot() {
  const { isDarkMode } = useThemeStore()
  const theme = createAppTheme(isDarkMode ? 'dark' : 'light')
  const hasWebGLSupport = isWebGLSupported()

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {hasWebGLSupport ? (
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        ) : (
          <WebglNotSupportedPage />
        )}
      </ThemeProvider>
    </StrictMode>
  )
}

root.render(<AppRoot />)
