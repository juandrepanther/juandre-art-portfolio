export type TWorldPosition = [number, number, number]

export interface ITreeLayout {
  monkeyPosition: TWorldPosition
  treePosition: TWorldPosition
}

export interface ICrateLayout {
  position: TWorldPosition
  rotationY: number
  size: [number, number, number]
}

import {
  BOX_LAYOUTS,
  CRATE_FOOTPRINT_PADDING,
  CRATE_LAYOUT_COUNT,
  CRATE_PLACEMENT_ATTEMPTS,
  CRATE_PLACEMENT_MARGIN,
  CRATE_SIZE_PRESETS,
  CRATE_STACK_HEIGHT_MAX,
  GAME_ARENA_HALF_SIZE,
  PLAYER_START_CRATE_EXCLUSION_RADIUS,
  PLAYER_START_POSITION,
  TREE_LAYOUTS,
  TREE_TRUNK_COLLIDER_ARGS
} from './settings'

interface ICrateStackLayout {
  positionX: number
  positionZ: number
  rotationY: number
  size: ICrateLayout['size']
  stackHeight: number
}

function cloneCrateSize(size: ICrateLayout['size']): ICrateLayout['size'] {
  return [size[0], size[1], size[2]]
}

function cloneCrateLayout(crateLayout: ICrateLayout): ICrateLayout {
  return {
    position: [
      crateLayout.position[0],
      crateLayout.position[1],
      crateLayout.position[2]
    ],
    rotationY: crateLayout.rotationY,
    size: cloneCrateSize(crateLayout.size)
  }
}

function getCrateFootprintRadius(size: ICrateLayout['size']) {
  return Math.hypot(size[0], size[2]) / 2 + CRATE_FOOTPRINT_PADDING
}

function doesStackOverlapTrees(
  positionX: number,
  positionZ: number,
  footprintRadius: number
) {
  const treeCollisionRadius =
    Math.max(TREE_TRUNK_COLLIDER_ARGS[0], TREE_TRUNK_COLLIDER_ARGS[2]) +
    footprintRadius

  return TREE_LAYOUTS.some(({ treePosition }) => {
    const deltaX = positionX - treePosition[0]
    const deltaZ = positionZ - treePosition[2]

    return (
      deltaX * deltaX + deltaZ * deltaZ <=
      treeCollisionRadius * treeCollisionRadius
    )
  })
}

function doesStackOverlapPlayerStart(
  positionX: number,
  positionZ: number,
  footprintRadius: number
) {
  const deltaX = positionX - PLAYER_START_POSITION[0]
  const deltaZ = positionZ - PLAYER_START_POSITION[2]
  const collisionRadius = PLAYER_START_CRATE_EXCLUSION_RADIUS + footprintRadius

  return deltaX * deltaX + deltaZ * deltaZ <= collisionRadius * collisionRadius
}

function doesStackOverlapOtherStacks(
  positionX: number,
  positionZ: number,
  footprintRadius: number,
  stacks: ICrateStackLayout[]
) {
  return stacks.some((stack) => {
    const deltaX = positionX - stack.positionX
    const deltaZ = positionZ - stack.positionZ
    const collisionRadius =
      footprintRadius + getCrateFootprintRadius(stack.size)

    return (
      deltaX * deltaX + deltaZ * deltaZ <= collisionRadius * collisionRadius
    )
  })
}

function createRandomCrateStack(
  existingStacks: ICrateStackLayout[],
  remainingCrates: number
) {
  const size = cloneCrateSize(
    CRATE_SIZE_PRESETS[Math.floor(Math.random() * CRATE_SIZE_PRESETS.length)] ??
      CRATE_SIZE_PRESETS[0]
  )
  const stackHeight =
    1 +
    Math.floor(
      Math.random() * Math.min(CRATE_STACK_HEIGHT_MAX, remainingCrates)
    )
  const rotationY = (Math.random() - 0.5) * Math.PI
  const footprintRadius = getCrateFootprintRadius(size)
  const spawnRange =
    GAME_ARENA_HALF_SIZE - footprintRadius - CRATE_PLACEMENT_MARGIN

  for (
    let attemptIndex = 0;
    attemptIndex < CRATE_PLACEMENT_ATTEMPTS;
    attemptIndex += 1
  ) {
    const positionX = (Math.random() - 0.5) * spawnRange * 2
    const positionZ = (Math.random() - 0.5) * spawnRange * 2

    if (
      doesStackOverlapTrees(positionX, positionZ, footprintRadius) ||
      doesStackOverlapPlayerStart(positionX, positionZ, footprintRadius) ||
      doesStackOverlapOtherStacks(
        positionX,
        positionZ,
        footprintRadius,
        existingStacks
      )
    ) {
      continue
    }

    return {
      positionX,
      positionZ,
      rotationY,
      size,
      stackHeight
    }
  }

  return null
}

export function createRandomBoxLayouts(): ICrateLayout[] {
  const stackLayouts: ICrateStackLayout[] = []
  let remainingCrates = CRATE_LAYOUT_COUNT

  while (remainingCrates > 0) {
    const stackLayout = createRandomCrateStack(stackLayouts, remainingCrates)

    if (!stackLayout) {
      return BOX_LAYOUTS.map(cloneCrateLayout)
    }

    stackLayouts.push(stackLayout)
    remainingCrates -= stackLayout.stackHeight
  }

  return stackLayouts.flatMap((stackLayout) => {
    const [, crateHeight] = stackLayout.size

    return Array.from({ length: stackLayout.stackHeight }, (_, levelIndex) => {
      const position: TWorldPosition = [
        stackLayout.positionX,
        crateHeight / 2 + crateHeight * levelIndex,
        stackLayout.positionZ
      ]

      return {
        position,
        rotationY: stackLayout.rotationY,
        size: cloneCrateSize(stackLayout.size)
      }
    })
  })
}
