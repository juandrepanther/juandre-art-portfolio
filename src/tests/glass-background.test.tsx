import { screen } from 'shadow-dom-testing-library'
import { describe, expect, it } from 'vitest'
import GlassBackground from '../pages/home-page/glass-background'
import { renderWithProviders } from './tests-helpers'

describe('GlassBackground', () => {
  it('renders the static fallback when browser shader APIs are unavailable', () => {
    renderWithProviders(<GlassBackground />)

    expect(screen.getByLabelText(/static visual fallback/i)).toBeInTheDocument()
  })

  it('renders the static fallback when reduced motion is enabled', () => {
    renderWithProviders(<GlassBackground isReducedMotion />)

    expect(screen.getByLabelText(/static visual fallback/i)).toBeInTheDocument()
  })
})