import { describe, expect, it } from 'vitest'
import { isPointInsideAnyCrate, isPointInsideCrate } from 'pages/game-page/world-collision'
import { BOX_LAYOUTS } from 'pages/game-page/world-layout'

describe('world collision helpers', () => {
  it('detects points inside an axis-aligned crate volume', () => {
    const crate = BOX_LAYOUTS[0]

    expect(
      isPointInsideCrate([crate.position[0], crate.position[1], crate.position[2]], crate)
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
})
