import { ARENA_HALF_SIZE } from '../settings'
import {
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
} from '../settings'

type TRandom = () => number

export interface ILightningStrike {
  duration: number
  intensity: number
  pulseFrequency: number
  pulsePhase: number
  seed: number
  spread: number
  startedAt: number
  x: number
  z: number
}

export interface ILightningFrameState {
  ambientLift: number
  boltVisibility: number
  branchOffset: number
  flashIntensity: number
  isComplete: boolean
}

function sampleRange(minimum: number, maximum: number, random: TRandom) {
  return minimum + (maximum - minimum) * random()
}

function smoothstep(minimum: number, maximum: number, value: number) {
  const normalizedValue = Math.max(
    0,
    Math.min(1, (value - minimum) / (maximum - minimum))
  )

  return normalizedValue * normalizedValue * (3 - 2 * normalizedValue)
}

export function createLightningCooldown(random: TRandom = Math.random) {
  return sampleRange(
    LIGHTNING_MIN_COOLDOWN_SECONDS,
    LIGHTNING_MAX_COOLDOWN_SECONDS,
    random
  )
}

export function createLightningStrike(
  startedAt: number,
  random: TRandom = Math.random
): ILightningStrike {
  const strikeRadius = ARENA_HALF_SIZE * 1.45

  return {
    duration: sampleRange(
      LIGHTNING_MIN_DURATION_SECONDS,
      LIGHTNING_MAX_DURATION_SECONDS,
      random
    ),
    intensity: sampleRange(
      LIGHTNING_MIN_INTENSITY,
      LIGHTNING_MAX_INTENSITY,
      random
    ),
    pulseFrequency: sampleRange(
      LIGHTNING_MIN_PULSE_FREQUENCY,
      LIGHTNING_MAX_PULSE_FREQUENCY,
      random
    ),
    pulsePhase: sampleRange(0, Math.PI * 2, random),
    seed: sampleRange(0.15, 0.95, random),
    spread: sampleRange(LIGHTNING_MIN_SPREAD, LIGHTNING_MAX_SPREAD, random),
    startedAt,
    x: (random() - 0.5) * strikeRadius,
    z: (random() - 0.5) * strikeRadius
  }
}

export function getLightningFrameState(
  strike: ILightningStrike,
  now: number
): ILightningFrameState {
  const elapsed = now - strike.startedAt

  if (elapsed <= 0) {
    return {
      ambientLift: 0,
      boltVisibility: 0,
      branchOffset: 0,
      flashIntensity: 0,
      isComplete: false
    }
  }

  const fullDuration = strike.duration + LIGHTNING_AFTERGLOW_SECONDS
  const progress = elapsed / strike.duration
  const fullProgress = elapsed / fullDuration
  const fadeOut = 1 - smoothstep(0.16, 1, progress)
  const pulse = Math.sin(elapsed * strike.pulseFrequency + strike.pulsePhase)
  const strobe = Math.pow(Math.max(0, pulse * 0.5 + 0.5), 3.4)
  const afterglow =
    strike.intensity * (1 - smoothstep(0, 1, fullProgress)) * 0.34
  const earlyFlash = 1 - smoothstep(0, 0.14, progress)
  const flashIntensity =
    strike.intensity * (0.2 + strobe * 0.8) * fadeOut + afterglow
  const boltVisibility = Math.max(
    flashIntensity,
    strike.intensity * earlyFlash * 0.92
  )
  const ambientLift = Math.max(
    afterglow,
    strike.intensity * (0.18 + strobe * 0.26) * (1 - smoothstep(0, 1, progress))
  )

  return {
    ambientLift,
    boltVisibility,
    branchOffset:
      Math.sin(progress * Math.PI * 2.6 + strike.seed * Math.PI * 4) *
      strike.spread *
      0.5,
    flashIntensity,
    isComplete: elapsed >= fullDuration
  }
}
