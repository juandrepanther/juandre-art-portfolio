import { screen } from 'shadow-dom-testing-library'
import { type ComponentType, type ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as reactDeviceDetect from 'react-device-detect'
import GlassBackground from 'pages/home-page/glass-background'
import { renderWithProviders } from './tests-helpers'

vi.mock('shaders/react', () => {
  const createShaderComponent = (
    label: string
  ): ComponentType<{ children?: ReactNode }> => {
    const Component = ({ children }: { children?: ReactNode }) => (
      <div aria-label={label}>{children}</div>
    )

    return Component
  }

  return {
    ChromaFlow: createShaderComponent('ChromaFlow'),
    FlutedGlass: createShaderComponent('FlutedGlass'),
    Shader: createShaderComponent('Shader'),
    Swirl: createShaderComponent('Swirl')
  }
})

describe('GlassBackground', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the shader stack on desktop', () => {
    vi.spyOn(reactDeviceDetect, 'isMobile', 'get').mockReturnValue(false)

    renderWithProviders(<GlassBackground />)

    expect(screen.getByLabelText('Shader')).toBeInTheDocument()
    expect(screen.getByLabelText('Swirl')).toBeInTheDocument()
    expect(screen.getByLabelText('ChromaFlow')).toBeInTheDocument()
    expect(screen.getByLabelText('FlutedGlass')).toBeInTheDocument()
  })

  it('renders the static fallback on mobile devices', () => {
    vi.spyOn(reactDeviceDetect, 'isMobile', 'get').mockReturnValue(true)

    renderWithProviders(<GlassBackground />)

    expect(screen.getByTestId('static-glass-background')).toBeInTheDocument()
    expect(screen.queryByLabelText('Shader')).not.toBeInTheDocument()
  })

  it('keeps the shader stack on desktop without mobile detection', () => {
    vi.spyOn(reactDeviceDetect, 'isMobile', 'get').mockReturnValue(false)

    renderWithProviders(<GlassBackground />)

    expect(screen.getByLabelText('Shader')).toBeInTheDocument()
    expect(
      screen.queryByTestId('static-glass-background')
    ).not.toBeInTheDocument()
  })
})
