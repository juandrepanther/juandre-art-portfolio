import { screen } from 'shadow-dom-testing-library'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useThemeStore } from '../lib/zustand/theme-store'
import HomePage from '../pages/home-page/home-page'
import { renderWithProviders } from './tests-helpers'

vi.mock('../pages/home-page/glass-background', () => ({
  default: function GlassBackground() {
    return <div data-testid="glass-background" />
  }
}))

describe('HomePage', () => {
  beforeEach(() => {
    useThemeStore.setState({ isDarkMode: true })
  })

  it('renders the hero content and primary calls to action', async () => {
    renderWithProviders(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(await screen.findByTestId('glass-background')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /skip to main content/i })
    ).toHaveAttribute('href', '#main-content')

    expect(
      screen.getByRole('heading', {
        name: /crafted depth for product, code, and play/i
      })
    ).toBeInTheDocument()
    expect(screen.getByText(/interactive cv application/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /maze game/i })).toHaveAttribute(
      'href',
      '/maze-game'
    )
    expect(screen.getByRole('link', { name: /launch maze/i })).toHaveAttribute(
      'href',
      '/maze-game'
    )
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      expect.stringContaining('Janis_Dregeris_CV')
    )
  })

  it('renders the profile, contact, and certificate sections', async () => {
    renderWithProviders(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(await screen.findByTestId('glass-background')).toBeInTheDocument()

    expect(screen.getByText('EXPERIENCE')).toBeInTheDocument()
    expect(screen.getByText('MY SKILLS')).toBeInTheDocument()
    expect(screen.getByText('EDUCATION & COURSES')).toBeInTheDocument()
    expect(screen.getByText('Contact & Presence')).toBeInTheDocument()
    expect(screen.getByText('FACEBOOK')).toBeInTheDocument()
    expect(screen.getByText('EMAIL')).toBeInTheDocument()
    expect(
      screen.getAllByText(/aws certified cloud practitioner/i).length
    ).toBeGreaterThan(0)
  })

  it('renders light mode content without losing key actions', async () => {
    useThemeStore.setState({ isDarkMode: false })

    renderWithProviders(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
      { isDarkMode: false }
    )

    expect(await screen.findByTestId('glass-background')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /toggle dark mode/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /download cv/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /launch maze/i })
    ).toBeInTheDocument()
  })
})
