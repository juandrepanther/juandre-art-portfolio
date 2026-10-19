import { act, fireEvent, waitFor } from '@testing-library/react'
import { screen } from 'shadow-dom-testing-library'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useThemeStore } from 'lib/zustand/theme-store'
import GamePage from 'pages/game-page/game-page'
import type { IGameSceneProps } from 'pages/game-page/helpers'
import { renderWithProviders } from './tests-helpers'

const mockedUseWindowSize = vi.fn()
const mockedUseProgress = vi.fn()

vi.mock('hooks/useWindowSize', () => ({
  default: () => mockedUseWindowSize()
}))

vi.mock('@react-three/drei', () => ({
  useProgress: () => mockedUseProgress()
}))

vi.mock('pages/game-page/game-scene/scene', () => ({
  default: function MockGameScene({
    health,
    isCameraOrbiting,
    onHealthChange
  }: IGameSceneProps) {
    return (
      <div data-testid="game-scene">
        <div>Scene health: {health}</div>
        <div>Scene orbit: {String(isCameraOrbiting)}</div>
        <button onClick={() => onHealthChange(65)} type="button">
          Trigger damage
        </button>
        <button onClick={() => onHealthChange(0)} type="button">
          Trigger loss
        </button>
        Mock Game Scene
      </div>
    )
  }
}))

vi.mock('pages/game-page/character-chooser/character-preview', () => ({
  default: function MockCharacterPreview({ characterConfig }) {
    return <div data-testid="character-preview">{characterConfig.label}</div>
  }
}))

describe('GamePage', () => {
  beforeEach(() => {
    vi.useRealTimers()
    useThemeStore.setState({ isDarkMode: true })
    mockedUseWindowSize.mockReturnValue({ height: 1200, width: 1440 })
    mockedUseProgress.mockReturnValue({
      active: true,
      errors: [],
      item: '/assets/models/enemy.glb',
      loaded: 3,
      progress: 60,
      total: 5
    })
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
    expect(screen.getByText('Scene orbit: true')).toBeInTheDocument()
    expect(screen.getByTestId('character-chooser')).toBeInTheDocument()
    expect(screen.getByTestId('character-preview')).toHaveTextContent(/max/i)
    expect(
      screen.getByRole('link', { name: /back to portfolio/i })
    ).toHaveAttribute('href', '/')
    expect(screen.getByText(/pick a difficulty/i)).toBeInTheDocument()
    expect(screen.getByText(/character select/i)).toBeInTheDocument()
    expect(screen.getByText(/click the scene/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^noob$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^hardcore$/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^hardcore$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    expect(screen.getByText(/mode: hardcore/i)).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: true')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^fight$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /change/i })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/loading game/i)
    expect(screen.getByRole('status')).toHaveTextContent(/60%/i)
    expect(screen.getByRole('status')).toHaveTextContent(/loading enemy\.glb/i)
    expect(screen.getByText(/scene health: 100/i)).toBeInTheDocument()
    expect(screen.getByText('01:00')).toBeInTheDocument()
    expect(screen.getByText(/enemies defeated/i)).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^spotify$/i })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^spotify$/i }))

    expect(screen.getByTestId('spotify-artist-player')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /close spotify player/i })
    ).toBeInTheDocument()
    expect(screen.getByTitle(/spotify artist player/i)).toHaveAttribute(
      'src',
      expect.stringContaining('/embed/artist/3ygNOpBpgEmQsKBdcO68li')
    )

    fireEvent.click(
      screen.getByRole('button', { name: /close spotify player/i })
    )

    expect(screen.getByTestId('spotify-artist-player')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(
      screen.queryByRole('button', { name: /close spotify player/i })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^spotify$/i })
    ).toBeInTheDocument()
  })

  it('reopens the chooser when the player wants a different character', () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))

    expect(screen.getByRole('button', { name: /change/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /change/i }))

    expect(screen.getByTestId('character-chooser')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
  })

  it('shows the desktop-only fallback on small viewports', () => {
    mockedUseWindowSize.mockReturnValue({ height: 768, width: 900 })

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    expect(screen.queryByTestId('game-scene')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
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

    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))

    expect(screen.getByText('PREPARE')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: false')).toBeInTheDocument()
    expect(
      screen.getByText(/the run begins in two seconds/i)
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(
      screen.getByText(/the run begins in two seconds/i)
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.queryByText('PREPARE')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^restart$/i })
    ).toBeInTheDocument()
  })

  it('passes updated health back into the scene contract', () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    expect(screen.getByText(/scene health: 100/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /trigger damage/i }))

    expect(screen.getByText(/scene health: 65/i)).toBeInTheDocument()
  })

  it('shows a game over image popup with replay when health reaches zero', async () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /trigger loss/i }))

    expect(
      screen.getByRole('img', { name: /game over result/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: true')).toBeInTheDocument()
    expect(screen.getByText('LOST')).toBeInTheDocument()

    const replayButton = screen.getByRole('button', { name: /replay/i })

    expect(replayButton).toBeInTheDocument()

    fireEvent.click(replayButton)

    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: /game over result/i })
      ).not.toBeInTheDocument()
    })
  })

  it('shows a victory image popup with replay when the round ends', async () => {
    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))

    for (let second = 0; second < 18; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
    }

    expect(
      screen.getByRole('img', { name: /victory result/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: true')).toBeInTheDocument()
    expect(screen.getByText('WIN')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /replay/i })).toBeInTheDocument()
  })
})
