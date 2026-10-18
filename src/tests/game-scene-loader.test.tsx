import { render } from '@testing-library/react'
import { screen } from 'shadow-dom-testing-library'
import { describe, expect, it, vi } from 'vitest'
import GameSceneLoaderOverlay from 'pages/game-page/game-scene/game-scene-loader'

const mockedUseProgress = vi.fn()

vi.mock('@react-three/drei', () => ({
  useProgress: () => mockedUseProgress()
}))

describe('GameSceneLoaderOverlay', () => {
  it('renders loading progress details while assets are loading', () => {
    mockedUseProgress.mockReturnValue({
      active: true,
      errors: [],
      item: '/assets/models/painkiller.glb',
      loaded: 2,
      progress: 40,
      total: 5
    })

    render(<GameSceneLoaderOverlay />)

    expect(screen.getByRole('status')).toHaveTextContent(/loading game/i)
    expect(screen.getByRole('status')).toHaveTextContent(
      /loading painkiller\.glb/i
    )
    expect(screen.getByRole('status')).toHaveTextContent(/2 of 5 assets ready/i)
    expect(screen.getByRole('status')).toHaveTextContent(/40%/i)
    expect(
      screen.getByRole('progressbar', { name: /game loading progress/i })
    ).toHaveAttribute('aria-valuenow', '40')
  })

  it('renders nothing when no assets are loading', () => {
    mockedUseProgress.mockReturnValue({
      active: false,
      errors: [],
      item: '',
      loaded: 0,
      progress: 0,
      total: 0
    })

    render(<GameSceneLoaderOverlay />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
