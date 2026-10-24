import { describe, expect, it } from 'vitest'
import {
  doesCircleIntersectAnyCrate,
  doesCircleIntersectCrate,
  findHighestCrateTopUnderCircle,
  getCrateTopHeight,
  isPointInsideAnyCrate,
  isPointInsideCrate
} from 'pages/game-page/world-collision'
import { createRuntimeCrateLayout } from 'pages/game-page/crate-height-animation'
import type { ICrateLayout } from 'pages/game-page/world-layout'

const crateLayouts: ICrateLayout[] = [
  {
    position: [-20, 0.9, -14],
    rotationY: 0,
    size: [2.4, 1.8, 2.1]
  },
  {
    position: [-9, 0.85, 6],
    rotationY: 0.52,
    size: [2.1, 1.7, 2.1]
  },
  {
    position: [22, 0.8, -10],
    rotationY: -0.2,
    size: [2, 1.6, 2]
  }
]

describe('world collision helpers', () => {
  it('detects points inside an axis-aligned crate volume', () => {
    const crate = crateLayouts[0]

    expect(
      isPointInsideCrate(
        [crate.position[0], crate.position[1], crate.position[2]],
        crate
      )
    ).toBe(true)
  })

  it('detects points inside a rotated crate volume', () => {
    const crate = crateLayouts[1]

    expect(
      isPointInsideCrate(
        [crate.position[0] + 0.35, crate.position[1], crate.position[2] - 0.2],
        crate,
        0.05
      )
    ).toBe(true)
  })

  it('rejects points outside all crate volumes', () => {
    expect(isPointInsideAnyCrate([0, 4, 0], crateLayouts)).toBe(false)
    expect(isPointInsideAnyCrate([36, 0.7, -35], crateLayouts)).toBe(false)
  })

  it('detects circle overlap with a crate face', () => {
    const crate = crateLayouts[0]

    expect(
      doesCircleIntersectCrate(
        { x: crate.position[0] + 1.45, z: crate.position[2] },
        0.5,
        crate,
        0.08
      )
    ).toBe(true)
  })

  it('rejects circles that are clear of all crates', () => {
    expect(
      doesCircleIntersectAnyCrate({ x: 35, z: -34 }, 0.6, crateLayouts, 0.08)
    ).toBe(false)
  })

  it('returns the highest crate top under an overlapping circle', () => {
    const firstCrate = crateLayouts[0]
    const secondCrate = crateLayouts[2]

    expect(
      findHighestCrateTopUnderCircle(
        { x: firstCrate.position[0], z: firstCrate.position[2] },
        0.6,
        [firstCrate, secondCrate],
        0.08
      )
    ).toBe(getCrateTopHeight(firstCrate))
  })

  it('returns null when no crate sits under the circle', () => {
    expect(
      findHighestCrateTopUnderCircle({ x: 35, z: -34 }, 0.6, crateLayouts, 0.08)
    ).toBeNull()
  })

  it('uses animated crate heights when runtime crate layouts are provided', () => {
    const crate = crateLayouts[0]
    const maxPulseElapsedTime = Math.PI / (2 * 2.4)
    const animatedCrate = createRuntimeCrateLayout(
      crate,
      maxPulseElapsedTime,
      true,
      0
    )

    expect(getCrateTopHeight(animatedCrate)).toBeGreaterThan(
      getCrateTopHeight(crate)
    )
    expect(
      findHighestCrateTopUnderCircle(
        { x: crate.position[0], z: crate.position[2] },
        0.6,
        [animatedCrate],
        0.08
      )
    ).toBe(getCrateTopHeight(animatedCrate))
  })
})
