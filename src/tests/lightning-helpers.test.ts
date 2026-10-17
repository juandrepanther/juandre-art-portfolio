import { describe, expect, it } from 'vitest'
import {
  createLightningCooldown,
  createLightningStrike,
  getLightningFrameState
} from 'pages/game-page/game-scene/lightning-helpers'
import {
  ARENA_HALF_SIZE,
  LIGHTNING_AFTERGLOW_SECONDS,
  LIGHTNING_MAX_COOLDOWN_SECONDS,
  LIGHTNING_MAX_DURATION_SECONDS,
  LIGHTNING_MAX_INTENSITY,
  LIGHTNING_MAX_PULSE_FREQUENCY,
  LIGHTNING_MAX_SPREAD,
  LIGHTNING_MIN_COOLDOWN_SECONDS,
  LIGHTNING_MIN_DURATION_SECONDS,
  LIGHTNING_MIN_INTENSITY,
  LIGHTNING_MIN_PULSE_FREQUENCY,
  LIGHTNING_MIN_SPREAD
} from 'pages/game-page/settings'

function createSequenceRandom(values: number[]) {
  let index = 0

  return () => {
    const value = values[index]

    index += 1

    return value ?? values.at(-1) ?? 0
  }
}

describe('lightning helpers', () => {
  it('samples lightning cooldown inside the configured range', () => {
    expect(createLightningCooldown(() => 0)).toBe(
      LIGHTNING_MIN_COOLDOWN_SECONDS
    )
    expect(createLightningCooldown(() => 1)).toBe(
      LIGHTNING_MAX_COOLDOWN_SECONDS
    )
  })

  it('creates a deterministic strike from the provided random source', () => {
    const strike = createLightningStrike(
      12,
      createSequenceRandom([0, 1, 0.25, 0.5, 0.75, 1, 0.5, 0])
    )

    expect(strike.startedAt).toBe(12)
    expect(strike.duration).toBe(LIGHTNING_MIN_DURATION_SECONDS)
    expect(strike.intensity).toBe(LIGHTNING_MAX_INTENSITY)
    expect(strike.pulseFrequency).toBe(
      LIGHTNING_MIN_PULSE_FREQUENCY +
        (LIGHTNING_MAX_PULSE_FREQUENCY - LIGHTNING_MIN_PULSE_FREQUENCY) * 0.25
    )
    expect(strike.pulsePhase).toBe(Math.PI)
    expect(strike.seed).toBe(0.75)
    expect(strike.spread).toBe(LIGHTNING_MAX_SPREAD)
    expect(strike.x).toBe(0)
    expect(strike.z).toBe(-ARENA_HALF_SIZE * 1.45 * 0.5)
  })

  it('keeps strike properties inside the configured bounds', () => {
    const strike = createLightningStrike(0, () => 0.42)

    expect(strike.duration).toBeGreaterThanOrEqual(
      LIGHTNING_MIN_DURATION_SECONDS
    )
    expect(strike.duration).toBeLessThanOrEqual(LIGHTNING_MAX_DURATION_SECONDS)
    expect(strike.intensity).toBeGreaterThanOrEqual(LIGHTNING_MIN_INTENSITY)
    expect(strike.intensity).toBeLessThanOrEqual(LIGHTNING_MAX_INTENSITY)
    expect(strike.pulseFrequency).toBeGreaterThanOrEqual(
      LIGHTNING_MIN_PULSE_FREQUENCY
    )
    expect(strike.pulseFrequency).toBeLessThanOrEqual(
      LIGHTNING_MAX_PULSE_FREQUENCY
    )
    expect(strike.spread).toBeGreaterThanOrEqual(LIGHTNING_MIN_SPREAD)
    expect(strike.spread).toBeLessThanOrEqual(LIGHTNING_MAX_SPREAD)
  })

  it('returns an inactive frame state before the strike starts', () => {
    const strike = createLightningStrike(4, () => 0.3)

    expect(getLightningFrameState(strike, 4)).toEqual({
      ambientLift: 0,
      boltVisibility: 0,
      branchOffset: 0,
      flashIntensity: 0,
      isComplete: false
    })
  })

  it('produces visible flash values during the active strike window', () => {
    const strike = createLightningStrike(0, () => 0.4)
    const frameState = getLightningFrameState(strike, strike.duration * 0.2)

    expect(frameState.flashIntensity).toBeGreaterThan(0)
    expect(frameState.boltVisibility).toBeGreaterThan(0)
    expect(frameState.ambientLift).toBeGreaterThan(0)
    expect(Math.abs(frameState.branchOffset)).toBeLessThanOrEqual(
      strike.spread * 0.5
    )
    expect(frameState.isComplete).toBe(false)
  })

  it('marks the strike complete after the afterglow expires', () => {
    const strike = createLightningStrike(0, () => 0.6)
    const frameState = getLightningFrameState(
      strike,
      strike.duration + LIGHTNING_AFTERGLOW_SECONDS + 0.01
    )

    expect(frameState.isComplete).toBe(true)
  })
})
