import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

interface IInteractiveSurfaceOptions {
  backgroundOpacity?: number
  hoverBackgroundOpacity?: number
  borderOpacity?: number
  hoverBorderOpacity?: number
  lift?: number
  scale?: number
  shadowOpacity?: number
  hoverShadowOpacity?: number
  enableFocusVisible?: boolean
}

function createSurfaceColor(theme: Theme, opacity: number) {
  return alpha(theme.palette.text.primary, opacity)
}

function createGlowColor(theme: Theme, opacity: number) {
  return alpha(theme.palette.secondary.main, opacity)
}

export function createInteractiveSurfaceSx(
  options: IInteractiveSurfaceOptions = {}
) {
  const {
    backgroundOpacity,
    hoverBackgroundOpacity = backgroundOpacity,
    borderOpacity,
    hoverBorderOpacity = borderOpacity,
    lift = 2,
    scale = 1,
    shadowOpacity = 0,
    hoverShadowOpacity = shadowOpacity,
    enableFocusVisible = false
  } = options

  return (theme) => {
    const interactiveState = {
      ...(hoverBackgroundOpacity !== undefined
        ? {
            backgroundColor: createSurfaceColor(theme, hoverBackgroundOpacity)
          }
        : {}),
      ...(hoverBorderOpacity !== undefined
        ? {
            borderColor: createSurfaceColor(theme, hoverBorderOpacity)
          }
        : {}),
      ...(hoverShadowOpacity > 0
        ? {
            boxShadow: `0 18px 38px ${createGlowColor(theme, hoverShadowOpacity)}`
          }
        : {}),
      transform:
        lift === 0 && scale === 1
          ? 'none'
          : `translateY(-${lift}px) scale(${scale})`
    }

    return {
      ...(backgroundOpacity !== undefined
        ? { backgroundColor: createSurfaceColor(theme, backgroundOpacity) }
        : {}),
      ...(borderOpacity !== undefined
        ? { borderColor: createSurfaceColor(theme, borderOpacity) }
        : {}),
      ...(shadowOpacity > 0
        ? {
            boxShadow: `0 12px 28px ${createGlowColor(theme, shadowOpacity)}`
          }
        : {}),
      transition: theme.transitions.create(
        ['transform', 'background-color', 'border-color', 'box-shadow'],
        {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut
        }
      ),
      '&:hover': interactiveState,
      ...(enableFocusVisible
        ? {
            '&:focus-visible': interactiveState
          }
        : {}),
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover': {
          transform: 'none'
        },
        ...(enableFocusVisible
          ? {
              '&:focus-visible': {
                transform: 'none'
              }
            }
          : {})
      }
    }
  }
}
