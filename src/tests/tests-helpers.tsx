import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { useThemeStore } from '../lib/zustand/theme-store'

interface ITestProvider {
  children: ReactNode
  isDarkMode?: boolean
}

interface IRenderWithProviders {
  isDarkMode?: boolean
}

function createAppTheme(isDarkMode: boolean) {
  return createTheme({
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
}

function TestProvider({ children, isDarkMode = true }: ITestProvider) {
  const theme = createAppTheme(isDarkMode)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  { isDarkMode = true }: IRenderWithProviders = {}
) {
  useThemeStore.setState({ isDarkMode })

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProvider isDarkMode={isDarkMode}>{children}</TestProvider>
    )
  })
}
