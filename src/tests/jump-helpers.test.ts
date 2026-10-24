import { describe, expect, it } from 'vitest'
import {
  canUseAirJumpNearApex,
  getJumpApexY
} from 'pages/game-page/game-scene/jump-helpers'

describe('jump helpers', () => {
  it('calculates apex Y from jump start and jump physics values', () => {
    const apexY = getJumpApexY({
      gravity: 26,
      jumpStartY: 1.66,
      jumpVelocity: 11
    })

    expect(apexY).toBeCloseTo(3.9869230769)
  })

  it('allows air jump at the edge of the top apex zone', () => {
    const apexY = getJumpApexY({
      gravity: 26,
      jumpStartY: 1.66,
      jumpVelocity: 11
    })
    const jumpHeight = apexY - 1.66
    const topZoneThresholdY = apexY - jumpHeight * 0.1

    expect(
      canUseAirJumpNearApex({
        apexZoneRatio: 0.1,
        currentY: topZoneThresholdY,
        gravity: 26,
        jumpStartY: 1.66,
        jumpVelocity: 11
      })
    ).toBe(true)
  })

  it('blocks air jump before the top apex zone is reached', () => {
    expect(
      canUseAirJumpNearApex({
        apexZoneRatio: 0.1,
        currentY: 3.4,
        gravity: 26,
        jumpStartY: 1.66,
        jumpVelocity: 11
      })
    ).toBe(false)
  })

  it('blocks air jump when current position is above the physical apex', () => {
    expect(
      canUseAirJumpNearApex({
        apexZoneRatio: 0.1,
        currentY: 4.2,
        gravity: 26,
        jumpStartY: 1.66,
        jumpVelocity: 11
      })
    ).toBe(false)
  })

  it('blocks air jump for invalid jump physics or ratio values', () => {
    expect(
      canUseAirJumpNearApex({
        apexZoneRatio: 0,
        currentY: 3.9,
        gravity: 26,
        jumpStartY: 1.66,
        jumpVelocity: 11
      })
    ).toBe(false)
    expect(
      canUseAirJumpNearApex({
        apexZoneRatio: 0.1,
        currentY: 3.9,
        gravity: 0,
        jumpStartY: 1.66,
        jumpVelocity: 11
      })
    ).toBe(false)
  })
})
