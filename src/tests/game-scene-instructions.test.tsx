import { render } from '@testing-library/react'
import { screen } from 'shadow-dom-testing-library'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type ReactNode } from 'react'
import { GameSceneInstructions } from 'pages/game-page/game-scene/overlay'

vi.mock('@react-three/drei', () => ({
  Billboard: ({ children }: { children: ReactNode }) => (
    <div data-testid="billboard">{children}</div>
  ),
  Html: ({ children }: { children: ReactNode }) => (
    <div data-testid="html">{children}</div>
  )
}))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GameSceneInstructions', () => {
  it('renders a random quote from the JSON list and refreshes on remount', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.99)

    const { rerender } = render(<GameSceneInstructions key="round-1" />)

    expect(
      screen.getByText(
        /too much beer, and a man's heart will be open for all to see/i
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(/the saga of olaf haraldsson, c\.151/i)
    ).toBeInTheDocument()

    rerender(<GameSceneInstructions key="round-2" />)

    expect(
      screen.getByText(/a tale is but half told when only one person tells it/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/the saga of grettir/i)).toBeInTheDocument()
  })
})
