import type { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'

const darkPalette = {
  primary: {
    main: '#d98b4f',
    light: '#ebb58a',
    dark: '#9f5f2c',
    contrastText: '#111315'
  },
  secondary: {
    main: '#54c7b8',
    light: '#8be1d5',
    dark: '#2f8e82',
    contrastText: '#081311'
  },
  background: {
    default: '#0c1117',
    paper: '#17212b'
  },
  text: {
    primary: '#dce5ec',
    secondary: '#a8bbcb'
  },
  divider: 'rgba(220, 229, 236, 0.12)'
}

const lightPalette = {
  primary: {
    main: '#a85b23',
    light: '#c9804f',
    dark: '#7a3f15',
    contrastText: '#fff7f2'
  },
  secondary: {
    main: '#1f8a7a',
    light: '#55b7a8',
    dark: '#116255',
    contrastText: '#f4fffd'
  },
  background: {
    default: '#f3f5f8',
    paper: '#ffffff'
  },
  text: {
    primary: '#14202c',
    secondary: '#425364'
  },
  divider: 'rgba(20, 32, 44, 0.12)'
}

export function createAppTheme(mode: PaletteMode) {
  const isDarkMode = mode === 'dark'
  const palette = isDarkMode ? darkPalette : lightPalette

  return createTheme({
    palette: {
      mode,
      contrastThreshold: 4.5,
      ...palette
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
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            transition: 'background-color 180ms ease, color 180ms ease'
          },
          ':focus-visible': {
            outline: '3px solid #54c7b8',
            outlineOffset: '3px'
          },
          '::selection': {
            backgroundColor: isDarkMode
              ? 'rgba(139, 181, 234, 0.28)'
              : 'rgba(31, 138, 122, 0.2)'
          }
        }
      }
    }
  })
}
