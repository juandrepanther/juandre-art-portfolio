import { describe, expect, it } from 'vitest'
import { createAppTheme } from '../lib/mui/app-theme'

describe('createAppTheme', () => {
  it('creates the dark palette tokens', () => {
    const theme = createAppTheme('dark')

    expect(theme.palette.mode).toBe('dark')
    expect(theme.palette.background.default).toBe('#0c1117')
    expect(theme.palette.background.paper).toBe('#17212b')
    expect(theme.palette.primary.main).toBe('#d98b4f')
    expect(theme.palette.secondary.main).toBe('#54c7b8')
    expect(theme.palette.text.primary).toBe('#dce5ec')
  })

  it('creates the light palette tokens', () => {
    const theme = createAppTheme('light')

    expect(theme.palette.mode).toBe('light')
    expect(theme.palette.background.default).toBe('#f3f5f8')
    expect(theme.palette.background.paper).toBe('#ffffff')
    expect(theme.palette.primary.main).toBe('#a85b23')
    expect(theme.palette.secondary.main).toBe('#1f8a7a')
    expect(theme.palette.text.primary).toBe('#14202c')
  })
})
