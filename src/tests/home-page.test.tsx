import { fireEvent } from '@testing-library/react'
import { screen } from 'shadow-dom-testing-library'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useThemeStore } from 'lib/zustand/theme-store'
import HomePage from 'pages/home-page/home-page'
import { renderWithProviders } from './tests-helpers'

vi.mock('pages/home-page/glass-background', () => ({
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
        name: /crafted depth for product, code, and business/i
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /a portfolio experience that consolidates the full cv, contact information and art direction\./i
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute(
      'href',
      '#contact-presence'
    )
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      expect.stringContaining('Janis_Dregeris_CV')
    )
    expect(
      screen.getByRole('link', { name: /play banana run/i })
    ).toHaveAttribute('href', '/game')
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
    expect(screen.getByAltText('FACEBOOK')).toHaveStyle({
      filter: 'brightness(0) invert(1)'
    })
    expect(screen.getByAltText('UNREAL ENGINE 5')).toHaveStyle({
      filter: 'brightness(0) invert(1)'
    })
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
      screen.getByRole('switch', { name: /light mode/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /download cv/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
    expect(screen.getByAltText('FACEBOOK')).toHaveStyle({ filter: 'none' })
    expect(screen.getByAltText('UNREAL ENGINE 5')).toHaveStyle({
      filter: 'none'
    })
  })

  it('toggles between dark and light mode from the top app bar', async () => {
    renderWithProviders(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(await screen.findByTestId('glass-background')).toBeInTheDocument()

    const toggle = screen.getByRole('switch', { name: /dark mode/i })

    expect(toggle).toBeChecked()
    expect(screen.getByText('Dark mode')).toBeInTheDocument()

    fireEvent.click(toggle)

    expect(useThemeStore.getState().isDarkMode).toBe(false)
    expect(
      screen.getByRole('switch', { name: /light mode/i })
    ).not.toBeChecked()
    expect(screen.getByText('Light mode')).toBeInTheDocument()
  })
})
