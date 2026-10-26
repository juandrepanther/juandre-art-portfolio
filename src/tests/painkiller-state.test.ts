import { describe, expect, it } from 'vitest'
import type { ICrateLayout, ITreeLayout } from 'pages/game-page/helpers'
import { createPainkillerState } from 'pages/game-page/game-scene/helpers'

function createTreeLayouts(count: number): ITreeLayout[] {
  return Array.from({ length: count }, (_, index) => ({
    enemyPosition: [index + 1, 0, index + 1],
    treePosition: [index, 0, index]
  }))
}

describe('createPainkillerState', () => {
  it('activates only configured painkiller count', () => {
    const treeLayouts = createTreeLayouts(10)
    const crateLayouts: ICrateLayout[] = []

    const painkillerState = createPainkillerState(crateLayouts, treeLayouts, 4)
    const activePainkillerCount = painkillerState.filter(
      ({ active }) => active
    ).length
    const inactivePainkillerCount = painkillerState.filter(
      ({ active }) => !active
    ).length

    expect(activePainkillerCount).toBe(4)
    expect(inactivePainkillerCount).toBe(6)
    expect(
      painkillerState
        .filter(({ active }) => !active)
        .every(({ respawnAt }) => respawnAt === Number.POSITIVE_INFINITY)
    ).toBe(true)
  })

  it('clamps configured painkiller count to available tree layout count', () => {
    const treeLayouts = createTreeLayouts(3)
    const crateLayouts: ICrateLayout[] = []

    const painkillerState = createPainkillerState(crateLayouts, treeLayouts, 8)

    expect(painkillerState.every(({ active }) => active)).toBe(true)
  })
})
