import { screen } from 'shadow-dom-testing-library'
import type { ReactNode } from 'react'
import { lazy } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CHARACTER_CONFIGS } from 'pages/game-page/settings'
import CharacterPreview from 'pages/game-page/character-chooser/character-preview'
import { renderWithProviders } from './tests-helpers'

const modelState = {
  shouldSuspend: false
}

const SuspendedCharacterModel = lazy(
  () => new Promise<{ default: () => ReactNode }>(() => {})
)

function ResolvedCharacterModel() {
  return <div data-testid="character-model">Character model</div>
}

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-canvas">{children}</div>
  )
}))

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-html">{children}</div>
  ),
  OrbitControls: () => <div data-testid="mock-orbit-controls" />
}))

vi.mock('pages/game-page/character-chooser/character-model', () => ({
  default: function MockCharacterModel() {
    return modelState.shouldSuspend ? (
      <SuspendedCharacterModel />
    ) : (
      <ResolvedCharacterModel />
    )
  }
}))

describe('CharacterPreview', () => {
  afterEach(() => {
    modelState.shouldSuspend = false
  })

  it('shows a circular loader while the character model is loading', () => {
    modelState.shouldSuspend = true

    renderWithProviders(
      <CharacterPreview
        characterConfig={CHARACTER_CONFIGS['viking-raider']}
        isLandscapeMobile={false}
        isMobileViewport={false}
      />
    )

    expect(screen.getByRole('status')).toHaveTextContent(/loading character/i)
    expect(
      screen.getByRole('progressbar', { name: /loading character model/i })
    ).toBeInTheDocument()
    expect(screen.queryByTestId('character-model')).not.toBeInTheDocument()
  })

  it('hides the loader once the character model is rendered', () => {
    modelState.shouldSuspend = false

    renderWithProviders(
      <CharacterPreview
        characterConfig={CHARACTER_CONFIGS['viking-raider']}
        isLandscapeMobile={false}
        isMobileViewport={false}
      />
    )

    expect(screen.getByTestId('character-model')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
