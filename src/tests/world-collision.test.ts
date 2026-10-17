import { describe, expect, it } from 'vitest'
import {
  doesCircleIntersectAnyCrate,
  doesCircleIntersectCrate,
  findHighestCrateTopUnderCircle,
  getCrateTopHeight,
  isPointInsideAnyCrate,
  isPointInsideCrate
} from 'pages/game-page/world-collision'
import { BOX_LAYOUTS } from 'pages/game-page/settings'

describe('world collision helpers', () => {
  it('detects points inside an axis-aligned crate volume', () => {
    const crate = BOX_LAYOUTS[0]

    expect(
      isPointInsideCrate(
        [crate.position[0], crate.position[1], crate.position[2]],
        crate
      )
    ).toBe(true)
  })

  it('detects points inside a rotated crate volume', () => {
    const crate = BOX_LAYOUTS[5]

    expect(
      isPointInsideCrate(
        [crate.position[0] + 0.35, crate.position[1], crate.position[2] - 0.2],
        crate,
        0.05
      )
    ).toBe(true)
  })

  it('rejects points outside all crate volumes', () => {
    expect(isPointInsideAnyCrate([0, 4, 0], BOX_LAYOUTS)).toBe(false)
    expect(isPointInsideAnyCrate([36, 0.7, -35], BOX_LAYOUTS)).toBe(false)
  })

  it('detects circle overlap with a crate face', () => {
    const crate = BOX_LAYOUTS[0]

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
      doesCircleIntersectAnyCrate({ x: 35, z: -34 }, 0.6, BOX_LAYOUTS, 0.08)
    ).toBe(false)
  })

  it('returns the highest crate top under an overlapping circle', () => {
    const firstCrate = BOX_LAYOUTS[0]
    const secondCrate = BOX_LAYOUTS[3]

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
      findHighestCrateTopUnderCircle({ x: 35, z: -34 }, 0.6, BOX_LAYOUTS, 0.08)
    ).toBeNull()
  })
})
