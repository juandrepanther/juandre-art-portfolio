import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter } from 'react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useThemeStore } from './lib/zustand/theme-store'
import { AppRoutes } from './routes'
import './index.css'

const rootNode = document.getElementById('root')

if (!rootNode) {
  throw new Error('Root element was not found.')
}

const root = createRoot(rootNode)

function AppRoot() {
  const { isDarkMode } = useThemeStore()

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#d98b4f'
      },
      secondary: {
        main: '#54c7b8'
      },
      background: {
        default: isDarkMode ? '#0c1117' : '#f3f5f8',
        paper: isDarkMode ? '#17212b' : '#ffffff'
      },
      text: {
        primary: isDarkMode ? '#dce5ec' : '#14202c',
        secondary: isDarkMode ? '#a8bbcb' : '#425364'
      }
    },
    shape: {
      borderRadius: 24
    },
    typography: {
      fontFamily: 'Montserrat, Inter, sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.05em'
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.03em'
      }
    }
  })

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  )
}

root.render(<AppRoot />)
