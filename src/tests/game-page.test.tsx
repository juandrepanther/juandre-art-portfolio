import { act, fireEvent, waitFor, within } from '@testing-library/react'
import { screen } from 'shadow-dom-testing-library'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGameScoreboardStore } from 'lib/zustand/game-scoreboard-store'
import { useGameTemporaryScoreStore } from 'lib/zustand/game-temporary-score-store'
import { useThemeStore } from 'lib/zustand/theme-store'
import GamePage from 'pages/game-page/game-page'
import { formatTimeLabel } from 'pages/game-page/helpers'
import type { IGameSceneProps } from 'pages/game-page/helpers'
import {
  DIFFICULTY_CONFIGS,
  START_RUN_COUNTDOWN_SECONDS
} from 'pages/game-page/settings'
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
    onEnemyHit,
    onHealthChange,
    onPlayerHitIndicator
  }: IGameSceneProps) {
    return (
      <div data-testid="game-scene">
        <div>Scene health: {health}</div>
        <div>Scene orbit: {String(isCameraOrbiting)}</div>
        <button onClick={() => onEnemyHit()} type="button">
          Trigger enemy defeat
        </button>
        <button onClick={() => onHealthChange(65)} type="button">
          Trigger damage
        </button>
        <button onClick={() => onHealthChange(0)} type="button">
          Trigger loss
        </button>
        <button onClick={() => onPlayerHitIndicator?.('right')} type="button">
          Trigger right hit indicator
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
  const setPlayerName = (playerName: string) => {
    fireEvent.change(screen.getByRole('combobox', { name: /player name/i }), {
      target: { value: playerName }
    })
  }

  beforeEach(() => {
    vi.useRealTimers()
    useThemeStore.setState({ isDarkMode: true })
    useGameScoreboardStore.getState().resetScoreboard()
    useGameTemporaryScoreStore.getState().clearAllTemporary()
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
    vi.restoreAllMocks()
  })

  it('locks the game pointer when fight starts', () => {
    const requestPointerLockMock = vi.fn()
    const gameCanvas = document.createElement('canvas')

    Object.defineProperty(gameCanvas, 'requestPointerLock', {
      configurable: true,
      value: requestPointerLockMock
    })
    Object.defineProperty(document, 'exitPointerLock', {
      configurable: true,
      value: vi.fn()
    })

    const originalGetElementById = document.getElementById.bind(document)

    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'game-scene-canvas') {
        return gameCanvas
      }

      return originalGetElementById(id)
    })

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    requestPointerLockMock.mockClear()

    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))

    expect(requestPointerLockMock).toHaveBeenCalledTimes(1)
  })

  it('unlocks the game pointer when the round ends', () => {
    const exitPointerLockMock = vi.fn()

    Object.defineProperty(document, 'exitPointerLock', {
      configurable: true,
      value: exitPointerLockMock
    })

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    exitPointerLockMock.mockClear()

    setPlayerName('Player1')
    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /trigger loss/i }))

    expect(exitPointerLockMock).toHaveBeenCalled()
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
    expect(screen.getByRole('combobox', { name: /player name/i })).toHaveValue(
      ''
    )
    expect(
      screen.getByText(/type any player name to start/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/select a warrior/i)).toBeInTheDocument()
    expect(screen.getByText(/click the scene/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^noob$/i })).toBeInTheDocument()
    if (import.meta.env.DEV) {
      expect(screen.getByRole('button', { name: /^dev$/i })).toBeInTheDocument()
    } else {
      expect(
        screen.queryByRole('button', { name: /^dev$/i })
      ).not.toBeInTheDocument()
    }
    expect(
      screen.getByRole('button', { name: /^hardcore$/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^hardcore$/i }))
    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    expect(screen.getByText(/mode: hardcore/i)).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: true')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^fight$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^choose$/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^change$/i })
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^stop$/i })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/loading game/i)
    expect(screen.getByRole('status')).toHaveTextContent(/60%/i)
    expect(screen.getByRole('status')).toHaveTextContent(/loading enemy\.glb/i)
    expect(screen.getByText(/scene health: 100/i)).toBeInTheDocument()
    expect(
      screen.getByText(formatTimeLabel(DIFFICULTY_CONFIGS.Hardcore.roundTime))
    ).toBeInTheDocument()
    expect(screen.getByText(/enemies defeated/i)).toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('button', { name: /^spotify$/i })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^spotify$/i }))

    expect(screen.getByTestId('spotify-artist-player')).toBeInTheDocument()
    expect(screen.getByTestId('spotify-player-loader')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /close spotify player/i })
    ).toBeInTheDocument()

    const spotifyIframe = screen.getByTitle(
      /spotify artist player/i
    ) as HTMLIFrameElement

    fireEvent.load(spotifyIframe)

    expect(
      screen.queryByTestId('spotify-player-loader')
    ).not.toBeInTheDocument()
    expect(spotifyIframe).toHaveAttribute(
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

  it('disables choose when player name is empty', () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    const playerNameInput = screen.getByRole('combobox', {
      name: /player name/i
    })
    const chooseButton = screen.getByRole('button', { name: /^choose$/i })

    expect(chooseButton).toBeDisabled()

    fireEvent.change(playerNameInput, { target: { value: 'Player77' } })

    expect(chooseButton).toBeEnabled()

    fireEvent.change(playerNameInput, { target: { value: '' } })

    expect(chooseButton).toBeDisabled()
  })

  it('shows red validation helper for player name when scoreboard has no data', () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    expect(
      screen.getByText(/type any player name to start/i)
    ).toBeInTheDocument()
  })

  it('keeps scoreboard open-close behavior and confirms delete action', async () => {
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 5,
      playerName: 'Player99'
    })

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('scoreboard-panel')).toHaveAttribute(
      'aria-hidden',
      'false'
    )
    expect(screen.getByText('Player99')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /close scoreboard/i }))

    expect(screen.getByTestId('scoreboard-panel')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(
      screen.getByRole('button', { name: /^scoreboard$/i })
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^scoreboard$/i }))
    fireEvent.click(
      screen.getByRole('button', { name: /delete scoreboard data/i })
    )

    expect(screen.getByText('Sure to delete data?')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^no$/i }))

    await waitFor(() => {
      expect(screen.queryByText('Sure to delete data?')).not.toBeInTheDocument()
    })

    fireEvent.click(
      screen.getByRole('button', { name: /delete scoreboard data/i })
    )
    fireEvent.click(screen.getByRole('button', { name: /^yes$/i }))

    expect(screen.queryByText('Player99')).not.toBeInTheDocument()
    expect(screen.queryByText('N/A')).not.toBeInTheDocument()
  })

  it('highlights the scoreboard row for the current player', () => {
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 8,
      playerName: 'Player1'
    })
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 5,
      playerName: 'Player2'
    })

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))

    const scoreboardPanel = screen.getByTestId('scoreboard-panel')
    const playerOneLabel = screen
      .getAllByText('Player1')
      .find((node) => scoreboardPanel.contains(node))
    const playerTwoLabel = screen
      .getAllByText('Player2')
      .find((node) => scoreboardPanel.contains(node))

    expect(playerOneLabel?.closest('div')).toHaveAttribute(
      'data-current-player',
      'true'
    )
    expect(playerTwoLabel?.closest('div')).toHaveAttribute(
      'data-current-player',
      'false'
    )
  })

  it('hides the change action while the round is active', () => {
    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))

    expect(screen.getByText('PREPARE')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^change$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^choose$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^restart$/i })
    ).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByText('Scene orbit: false')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^change$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^choose$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^restart$/i })
    ).not.toBeInTheDocument()
  })

  it('reopens the chooser from the result dialog change action', async () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /trigger loss/i }))

    const changeButton = screen.getByRole('button', { name: /^change$/i })

    expect(changeButton).toBeInTheDocument()

    fireEvent.click(changeButton)

    await waitFor(() => {
      expect(screen.getByTestId('character-chooser')).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: /game over result/i })
      ).not.toBeInTheDocument()
    })
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
  })

  it('keeps spotify mounted when switching character from the result dialog', async () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /^spotify$/i }))

    const spotifyIframeBefore = screen.getByTitle(
      /spotify artist player/i
    ) as HTMLIFrameElement

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /trigger loss/i }))
    fireEvent.click(screen.getByRole('button', { name: /^change$/i }))

    await waitFor(() => {
      expect(screen.getByTestId('character-chooser')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: /game over result/i })
      ).not.toBeInTheDocument()
    })

    const spotifyIframeAfter = screen.getByTitle(
      /spotify artist player/i
    ) as HTMLIFrameElement

    expect(spotifyIframeAfter).toBe(spotifyIframeBefore)
    expect(screen.getByTestId('spotify-artist-player')).toHaveAttribute(
      'aria-hidden',
      'false'
    )
  })

  it('shows the rotate-device fallback on mobile portrait viewports', () => {
    mockedUseWindowSize.mockReturnValue({ height: 900, width: 500 })

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
      screen.getByText(/rotate your phone to landscape to play/i)
    ).toBeInTheDocument()
  })

  it('starts with the configured preparation countdown', async () => {
    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))

    expect(screen.getByText('PREPARE')).toBeInTheDocument()
    expect(
      screen.getByText(String(START_RUN_COUNTDOWN_SECONDS))
    ).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: false')).toBeInTheDocument()
    expect(
      screen.getByText(/the run begins in two seconds/i)
    ).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(
      screen.getByText(String(START_RUN_COUNTDOWN_SECONDS - 1))
    ).toBeInTheDocument()
    expect(
      screen.getByText(/the run begins in two seconds/i)
    ).toBeInTheDocument()

    for (let second = 0; second < START_RUN_COUNTDOWN_SECONDS; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
    }

    expect(screen.queryByText('PREPARE')).not.toBeInTheDocument()
    expect(screen.getByText('Scene orbit: false')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^restart$/i })
    ).not.toBeInTheDocument()
  })

  it('does not show a centered action button during countdown', () => {
    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))

    expect(screen.getByText('PREPARE')).toBeInTheDocument()
    expect(
      screen.getByText(String(START_RUN_COUNTDOWN_SECONDS))
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^fight$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^restart$/i })
    ).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(
      screen.getByText(String(START_RUN_COUNTDOWN_SECONDS - 1))
    ).toBeInTheDocument()
    expect(
      screen.queryByText(String(START_RUN_COUNTDOWN_SECONDS))
    ).not.toBeInTheDocument()
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

  it('shows directional hit marker next to pointer when scene reports hit side', () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(
      screen.getByRole('button', { name: /trigger right hit indicator/i })
    )

    expect(screen.getByTestId('game-pointer')).toBeInTheDocument()
    expect(
      screen.getByTestId('pointer-hit-indicator-right')
    ).toBeInTheDocument()
  })

  it('shows a game over image popup with replay when health reaches zero', async () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(
      screen.getByRole('button', { name: /trigger enemy defeat/i })
    )
    fireEvent.click(screen.getByRole('button', { name: /trigger loss/i }))

    expect(
      screen.getByRole('img', { name: /game over result/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: true')).toBeInTheDocument()
    expect(screen.getByText('LOST')).toBeInTheDocument()
    const resultDialog = screen.getByRole('dialog')

    expect(
      within(resultDialog).getByText(/enemies defeated/i)
    ).toBeInTheDocument()
    expect(within(resultDialog).getByText('1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute(
      'href',
      '/'
    )

    const replayButton = screen.getByRole('button', { name: /replay/i })
    const changeButton = screen.getByRole('button', { name: /^change$/i })

    expect(replayButton).toBeInTheDocument()
    expect(changeButton).toBeInTheDocument()

    fireEvent.click(replayButton)

    await waitFor(() => {
      expect(
        screen.queryByRole('img', { name: /game over result/i })
      ).not.toBeInTheDocument()
    })
  })

  it('saves enemies defeated to persistent scoreboard only when the round is won', async () => {
    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))
    fireEvent.click(
      screen.getByRole('button', { name: /trigger enemy defeat/i })
    )

    const roundCompletionSeconds =
      START_RUN_COUNTDOWN_SECONDS + DIFFICULTY_CONFIGS.Noob.roundTime + 1

    for (let second = 0; second < roundCompletionSeconds; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
    }

    const wonEntry = useGameScoreboardStore
      .getState()
      .scoreboardEntries.find(
        (scoreboardEntry) =>
          scoreboardEntry.playerName === 'Player1' &&
          scoreboardEntry.difficulty === 'Noob'
      )

    expect(wonEntry).toMatchObject({
      enemiesDefeated: 1,
      playerName: 'Player1',
      difficulty: 'Noob'
    })
  })

  it('does not save temporary score on loss and clears the temporary run', () => {
    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(
      screen.getByRole('button', { name: /trigger enemy defeat/i })
    )
    fireEvent.click(screen.getByRole('button', { name: /trigger loss/i }))

    const lostEntry = useGameScoreboardStore
      .getState()
      .scoreboardEntries.find(
        (scoreboardEntry) =>
          scoreboardEntry.playerName === 'Player1' &&
          scoreboardEntry.difficulty === 'Noob'
      )

    expect(lostEntry).toBeUndefined()
    expect(useGameTemporaryScoreStore.getState().pendingRun).toBeNull()
  })

  it('shows a victory image popup with replay when the round ends', async () => {
    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^choose$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))
    fireEvent.click(
      screen.getByRole('button', { name: /trigger enemy defeat/i })
    )

    const roundCompletionSeconds =
      START_RUN_COUNTDOWN_SECONDS + DIFFICULTY_CONFIGS.Noob.roundTime + 1

    for (let second = 0; second < roundCompletionSeconds; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
    }

    expect(
      screen.getByRole('img', { name: /victory result/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Scene orbit: true')).toBeInTheDocument()
    expect(screen.getByText('WIN')).toBeInTheDocument()
    const resultDialog = screen.getByRole('dialog')

    expect(
      within(resultDialog).getByText(/enemies defeated/i)
    ).toBeInTheDocument()
    expect(within(resultDialog).getByText('1')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^change$/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /replay/i })).toBeInTheDocument()
  })

  it('keeps the round running in DEV mode without a timer win', async () => {
    if (!import.meta.env.DEV) {
      return
    }

    vi.useFakeTimers()

    renderWithProviders(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    )

    setPlayerName('Player1')
    fireEvent.click(screen.getByRole('button', { name: /^dev$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^fight$/i }))

    const countdownAndRoundSeconds =
      START_RUN_COUNTDOWN_SECONDS + DIFFICULTY_CONFIGS.Noob.roundTime + 5

    for (let second = 0; second < countdownAndRoundSeconds; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
    }

    expect(screen.getByText(/mode: dev/i)).toBeInTheDocument()
    expect(screen.getByText(/^∞$/)).toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /victory result/i })
    ).not.toBeInTheDocument()
    expect(screen.getByText('Scene orbit: false')).toBeInTheDocument()
  })
})
