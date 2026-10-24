import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createAnimatedCrateFlags,
  createCrateAnimationOffsets,
  createInactiveAnimatedCrateFlags,
  createRuntimeCrateLayout,
  createRuntimeCrateLayouts,
  shouldAnimateCrateHeight
} from 'pages/game-page/crate-height-animation'
import {
  CRATE_HEIGHT_ANIMATION_MULTIPLIER_MAX,
  type TDifficultyLevel
} from 'pages/game-page/settings'
import type { ICrateLayout } from 'pages/game-page/world-layout'

const baseCrates: ICrateLayout[] = [
  {
    position: [4, 0.8, -3],
    rotationY: 0,
    size: [2, 1.6, 2]
  },
  {
    position: [-2, 0.9, 7],
    rotationY: 0.4,
    size: [2.2, 1.8, 2]
  },
  {
    position: [8, 0.85, 1],
    rotationY: -0.2,
    size: [2.1, 1.7, 2.1]
  },
  {
    position: [-9, 0.95, -4],
    rotationY: 0.1,
    size: [2.4, 1.9, 2.3]
  }
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('crate height animation helpers', () => {
  it('enables height animation only for Balls and Hardcore modes', () => {
    expect(shouldAnimateCrateHeight('Noob')).toBe(false)
    expect(shouldAnimateCrateHeight('Balls')).toBe(true)
    expect(shouldAnimateCrateHeight('Hardcore')).toBe(true)
  })

  it('marks half of crates as animated', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4)

    const flags = createAnimatedCrateFlags(10)

    expect(flags.filter(Boolean)).toHaveLength(5)
  })

  it('creates inactive crate animation flags with all values disabled', () => {
    expect(createInactiveAnimatedCrateFlags(4)).toEqual([
      false,
      false,
      false,
      false
    ])
  })

  it('creates animation offsets in the expected range', () => {
    const offsets = createCrateAnimationOffsets(16)

    expect(offsets).toHaveLength(16)

    for (const offset of offsets) {
      expect(offset).toBeGreaterThanOrEqual(0)
      expect(offset).toBeLessThanOrEqual(Math.PI * 2)
    }
  })

  it('returns base crate layout when animation is disabled', () => {
    const crate = baseCrates[0]

    expect(createRuntimeCrateLayout(crate, 2.4, false, 0.3)).toBe(crate)
  })

  it('scales crate height up to the configured max multiplier', () => {
    const crate = baseCrates[0]
    const maxPulseElapsedTime = Math.PI / (2 * 2.4)
    const runtimeCrate = createRuntimeCrateLayout(
      crate,
      maxPulseElapsedTime,
      true,
      0
    )

    expect(runtimeCrate.size[1]).toBeCloseTo(
      crate.size[1] * CRATE_HEIGHT_ANIMATION_MULTIPLIER_MAX
    )
    expect(runtimeCrate.position[1]).toBeGreaterThan(crate.position[1])
  })

  it('returns original crate layouts for non-animated difficulties', () => {
    const runtimeCrates = createRuntimeCrateLayouts({
      crateAnimationOffsets: [0, 0, 0, 0],
      crateLayouts: baseCrates,
      difficulty: 'Noob',
      elapsedTime: 12,
      isAnimatedCrateFlags: [true, true, true, true]
    })

    expect(runtimeCrates).toBe(baseCrates)
  })

  it('animates only selected crates for Balls and Hardcore', () => {
    const difficulties: TDifficultyLevel[] = ['Balls', 'Hardcore']

    for (const difficulty of difficulties) {
      const runtimeCrates = createRuntimeCrateLayouts({
        crateAnimationOffsets: [0, 0.2, 0.4, 0.6],
        crateLayouts: baseCrates,
        difficulty,
        elapsedTime: 3,
        isAnimatedCrateFlags: [true, false, true, false]
      })

      expect(runtimeCrates[0]?.size[1]).toBeGreaterThan(
        baseCrates[0]?.size[1] ?? 0
      )
      expect(runtimeCrates[1]).toBe(baseCrates[1])
      expect(runtimeCrates[2]?.size[1]).toBeGreaterThan(
        baseCrates[2]?.size[1] ?? 0
      )
      expect(runtimeCrates[3]).toBe(baseCrates[3])
    }
  })
})
