import {
  CRATE_HEIGHT_ANIMATION_DIFFICULTIES,
  CRATE_HEIGHT_ANIMATION_MULTIPLIER_MAX,
  CRATE_HEIGHT_ANIMATION_PULSE_SPEED,
  CRATE_HEIGHT_ANIMATION_RATIO,
  type TDifficultyLevel
} from './settings'
import type { ICrateLayout } from './world-layout'

interface IRuntimeCrateLayoutsInput {
  crateAnimationOffsets: number[]
  crateLayouts: ICrateLayout[]
  difficulty: TDifficultyLevel
  elapsedTime: number
  isAnimatedCrateFlags: boolean[]
}

function getCrateAnimatedHeightMultiplier(elapsedTime: number, offset = 0) {
  const pulse = Math.sin(
    elapsedTime * CRATE_HEIGHT_ANIMATION_PULSE_SPEED + offset
  )
  const normalizedPulse = (pulse + 1) / 2

  return 1 + normalizedPulse * (CRATE_HEIGHT_ANIMATION_MULTIPLIER_MAX - 1)
}

export function createRuntimeCrateLayout(
  crateLayout: ICrateLayout,
  elapsedTime: number,
  isAnimated: boolean,
  offset = 0
): ICrateLayout {
  if (!isAnimated) {
    return crateLayout
  }

  const [width, baseHeight, depth] = crateLayout.size
  const nextHeight =
    baseHeight * getCrateAnimatedHeightMultiplier(elapsedTime, offset)
  const nextCenterY = crateLayout.position[1] + (nextHeight - baseHeight) / 2

  return {
    combinationId: crateLayout.combinationId,
    position: [crateLayout.position[0], nextCenterY, crateLayout.position[2]],
    rotationY: crateLayout.rotationY,
    size: [width, nextHeight, depth]
  }
}

export function shouldAnimateCrateHeight(difficulty: TDifficultyLevel) {
  return CRATE_HEIGHT_ANIMATION_DIFFICULTIES.includes(difficulty)
}

export function createCrateAnimationOffsets(crateCount: number) {
  return Array.from({ length: crateCount }, () => Math.random() * Math.PI * 2)
}

export function createAnimatedCrateFlags(crateCount: number) {
  const animatedCrateFlags = Array.from({ length: crateCount }, () => false)
  const targetAnimatedCrateCount = Math.floor(
    crateCount * CRATE_HEIGHT_ANIMATION_RATIO
  )
  const availableIndices = Array.from(
    { length: crateCount },
    (_, index) => index
  )

  for (let index = availableIndices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentValue = availableIndices[index]
    availableIndices[index] = availableIndices[swapIndex] ?? currentValue
    availableIndices[swapIndex] = currentValue
  }

  for (let index = 0; index < targetAnimatedCrateCount; index += 1) {
    const animatedCrateIndex = availableIndices[index]

    if (animatedCrateIndex === undefined) {
      continue
    }

    animatedCrateFlags[animatedCrateIndex] = true
  }

  return animatedCrateFlags
}

export function createRuntimeCrateLayouts({
  crateAnimationOffsets,
  crateLayouts,
  difficulty,
  elapsedTime,
  isAnimatedCrateFlags
}: IRuntimeCrateLayoutsInput): ICrateLayout[] {
  if (!shouldAnimateCrateHeight(difficulty)) {
    return crateLayouts
  }

  return crateLayouts.map((crateLayout, index) =>
    createRuntimeCrateLayout(
      crateLayout,
      elapsedTime,
      isAnimatedCrateFlags[index] ?? false,
      crateAnimationOffsets[index]
    )
  )
}

export function createInactiveAnimatedCrateFlags(crateCount: number) {
  return Array.from({ length: crateCount }, () => false)
}
