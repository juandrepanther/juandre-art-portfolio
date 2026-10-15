import { describe, expect, it } from 'vitest'
import { createAppTheme } from 'lib/mui/app-theme'
import { createInteractiveSurfaceSx } from 'utils/interactive-surface'

describe('createInteractiveSurfaceSx', () => {
  it('creates a theme-aware hover and focus-visible style object', () => {
    const theme = createAppTheme('dark')
    const interactiveSurfaceSx = createInteractiveSurfaceSx({
      backgroundOpacity: 0.04,
      hoverBackgroundOpacity: 0.1,
      borderOpacity: 0.1,
      hoverBorderOpacity: 0.2,
      lift: 3,
      shadowOpacity: 0.05,
      hoverShadowOpacity: 0.16,
      enableFocusVisible: true
    })

    const styles = interactiveSurfaceSx(theme)

    expect(styles).toMatchObject({
      backgroundColor: 'rgba(220, 229, 236, 0.04)',
      borderColor: 'rgba(220, 229, 236, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(220, 229, 236, 0.1)',
        borderColor: 'rgba(220, 229, 236, 0.2)',
        transform: 'translateY(-3px) scale(1)'
      },
      '&:focus-visible': {
        backgroundColor: 'rgba(220, 229, 236, 0.1)',
        borderColor: 'rgba(220, 229, 236, 0.2)',
        transform: 'translateY(-3px) scale(1)'
      },
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
        '&:hover': {
          transform: 'none'
        },
        '&:focus-visible': {
          transform: 'none'
        }
      }
    })
  })
})
