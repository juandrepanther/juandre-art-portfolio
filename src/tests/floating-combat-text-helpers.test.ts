import { describe, expect, it } from 'vitest'
import {
  createFloatingCombatTextState,
  formatFloatingCombatTextValue,
  spawnFloatingCombatText,
  updateFloatingCombatTextStates
} from 'pages/game-page/game-scene/helpers'

describe('floating combat text helpers', () => {
  it('formats signed values for combat feedback text', () => {
    expect(formatFloatingCombatTextValue(20)).toBe('+20')
    expect(formatFloatingCombatTextValue(-40)).toBe('-40')
  })

  it('spawns and then expires floating combat text entries', () => {
    const floatingCombatTextStates = [createFloatingCombatTextState()]

    spawnFloatingCombatText(floatingCombatTextStates, {
      source: 'painkiller',
      value: 20
    })

    const [floatingCombatTextState] = floatingCombatTextStates

    expect(floatingCombatTextState.active).toBe(true)
    expect(floatingCombatTextState.value).toBe(20)
    expect(floatingCombatTextState.source).toBe('painkiller')
    expect(floatingCombatTextState.position.toArray()).toEqual([0, 0, 0])
    expect(floatingCombatTextState.velocity.y).toBeGreaterThan(0)

    updateFloatingCombatTextStates(floatingCombatTextStates, 10)

    expect(floatingCombatTextState.active).toBe(false)
    expect(floatingCombatTextState.value).toBe(0)
  })
})
