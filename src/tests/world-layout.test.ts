import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createRandomBoxLayouts,
  type ICrateLayout
} from 'pages/game-page/world-layout'
import {
  CRATE_LAYOUT_COUNT,
  CRATE_COMBINATION_BOX_MAX,
  PLAYER_START_CRATE_EXCLUSION_RADIUS,
  PLAYER_START_POSITION
} from 'pages/game-page/settings'

function createSeededRandom(seed: number) {
  let currentSeed = seed >>> 0

  return () => {
    currentSeed = (1664525 * currentSeed + 1013904223) >>> 0

    return currentSeed / 2 ** 32
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

function getCombinationLayouts(crateLayouts: ICrateLayout[]) {
  const layoutsByCombination = new Map<number, ICrateLayout[]>()

  for (const crateLayout of crateLayouts) {
    const combinationId = crateLayout.combinationId

    if (combinationId === undefined) {
      continue
    }

    const combinationLayouts = layoutsByCombination.get(combinationId) ?? []
    combinationLayouts.push(crateLayout)
    layoutsByCombination.set(combinationId, combinationLayouts)
  }

  return [...layoutsByCombination.values()]
}

describe('world layout crate combinations', () => {
  it('creates varied combinations with at most seven crates per combination', () => {
    vi.spyOn(Math, 'random').mockImplementation(createSeededRandom(17))

    const crateLayouts = createRandomBoxLayouts([])
    const combinationLayouts = getCombinationLayouts(crateLayouts)

    expect(crateLayouts).toHaveLength(CRATE_LAYOUT_COUNT)
    expect(combinationLayouts.length).toBeGreaterThan(0)

    for (const combination of combinationLayouts) {
      expect(combination.length).toBeLessThanOrEqual(CRATE_COMBINATION_BOX_MAX)
    }

    expect(
      combinationLayouts.some((combination) => combination.length > 1)
    ).toBe(true)

    expect(
      combinationLayouts.some((combination) => {
        const basePositions = new Set(
          combination.map(
            (layout) =>
              `${layout.position[0].toFixed(3)}:${layout.position[2].toFixed(3)}`
          )
        )

        return basePositions.size > 1
      })
    ).toBe(true)
  })

  it('keeps generated crates away from the player start exclusion area', () => {
    vi.spyOn(Math, 'random').mockImplementation(createSeededRandom(73))

    const crateLayouts = createRandomBoxLayouts([])

    for (const crateLayout of crateLayouts) {
      const [positionX, , positionZ] = crateLayout.position
      const footprintRadius =
        Math.hypot(crateLayout.size[0], crateLayout.size[2]) / 2
      const exclusionRadius =
        PLAYER_START_CRATE_EXCLUSION_RADIUS + footprintRadius
      const deltaX = positionX - PLAYER_START_POSITION[0]
      const deltaZ = positionZ - PLAYER_START_POSITION[2]

      expect(deltaX * deltaX + deltaZ * deltaZ).toBeGreaterThan(
        exclusionRadius * exclusionRadius
      )
    }
  })
})
