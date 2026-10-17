import { act, fireEvent, waitFor } from '@testing-library/react'
import { screen } from 'shadow-dom-testing-library'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThemeStore } from 'lib/zustand/theme-store'
import GamePage from 'pages/game-page/game-page'
import type { IGameSceneProps } from 'pages/game-page/helpers'
import { renderWithProviders } from './tests-helpers'

const mockedUseWindowSize = vi.fn()

vi.mock('hooks/useWindowSize', () => ({
  default: () => mockedUseWindowSize()
}))

vi.mock('pages/game-page/game-scene/scene', () => ({
  default: function MockGameScene({ onHealthChange }: IGameSceneProps) {
    return (
      <div data-testid="game-scene">
        <button onClick={() => onHealthChange(0)} type="button">
          Trigger loss
        </button>
        Mock Game Scene
      </div>
    )
  }
}))

describe('GamePage', () => {
  beforeEach(() => {
    vi.useRealTimers()
    useThemeStore.setState({ isDarkMode: true })
    mockedUseWindowSize.mockReturnValue({ height: 1200, width: 1440 })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the desktop game experience and controls', () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('game-scene')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /back to portfolio/i })
    ).toHaveAttribute('href', '/')
    expect(
      screen.getByText(/hold the grove for 15 seconds/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fight/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /noob/i })).toBeInTheDocument()
    expect(screen.getByText('00:15')).toBeInTheDocument()
    expect(screen.getByText(/enemies defeated/i)).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByTestId('spotify-artist-player')).toBeInTheDocument()
    expect(screen.getByTitle(/spotify artist player/i)).toHaveAttribute(
      'src',
      expect.stringContaining('/embed/artist/3ygNOpBpgEmQsKBdcO68li')
    )
  })

  it('shows the desktop-only fallback on small viewports', () => {
    mockedUseWindowSize.mockReturnValue({ height: 768, width: 900 })

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    expect(screen.queryByTestId('game-scene')).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('spotify-artist-player')
    ).not.toBeInTheDocument()
    expect(
      screen.getByText(/viking run is tuned for desktop controls only/i)
    ).toBeInTheDocument()
  })

  it('starts with a two second preparation countdown', () => {
    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /fight/i }))

    expect(screen.getByText('PREPARE')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText(/run starts in 2/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(/run starts in 1/i)).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByText('PREPARE')).not.toBeInTheDocument()
    expect(screen.getByText(/survive the axe storm/i)).toBeInTheDocument()
  })

  it('shows a game over modal with replay when health reaches zero', async () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /trigger loss/i }))

    expect(screen.getByText('GAME OVER')).toBeInTheDocument()
    expect(screen.getByText(/health to 0%/i)).toBeInTheDocument()

    const replayButton = screen.getByRole('button', { name: /replay/i })

    expect(replayButton).toBeInTheDocument()

    fireEvent.click(replayButton)

    await waitFor(() => {
      expect(screen.queryByText('GAME OVER')).not.toBeInTheDocument()
    })
  })
})
