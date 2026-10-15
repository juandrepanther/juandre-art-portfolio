import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { createAppTheme } from '../lib/mui/app-theme'
import { useThemeStore } from '../lib/zustand/theme-store'

interface ITestProvider {
  children: ReactNode
}

interface IRenderWithProviders {
  isDarkMode?: boolean
}

function TestProvider({ children }: ITestProvider) {
  const { isDarkMode } = useThemeStore()
  const theme = createAppTheme(isDarkMode ? 'dark' : 'light')

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
    wrapper: ({ children }) => <TestProvider>{children}</TestProvider>
  })
}
