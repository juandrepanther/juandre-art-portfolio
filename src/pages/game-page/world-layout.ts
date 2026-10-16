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

interface ICrateStackLayout {
  positionX: number
  positionZ: number
  rotationY: number
  size: ICrateLayout['size']
  stackHeight: number
}

export const GAME_ARENA_HALF_SIZE = 38
export const GAME_GROUND_SIZE = 104
export const GAME_FOG_NEAR = 22
export const GAME_FOG_FAR = 88
export const ARENA_BOUNDARY_COLLIDER_HEIGHT = 8
export const ARENA_BOUNDARY_COLLIDER_THICKNESS = 2
export const TREE_TRUNK_COLLIDER_ARGS: [number, number, number] = [
  0.85, 1.95, 0.85
]

export const PLAYER_START_POSITION: TWorldPosition = [0, 1.1, 23]

export const TREE_LAYOUTS: ITreeLayout[] = [
  {
    treePosition: [-28, 0, -24],
    monkeyPosition: [-28.9, 2.5, -25.1]
  },
  {
    treePosition: [-12, 0, -28],
    monkeyPosition: [-12.8, 2.4, -29]
  },
  {
    treePosition: [10, 0, -30],
    monkeyPosition: [9.3, 2.45, -31.1]
  },
  {
    treePosition: [28, 0, -22],
    monkeyPosition: [27.2, 2.35, -23.1]
  },
  {
    treePosition: [-31, 0, -4],
    monkeyPosition: [-31.8, 2.5, -5]
  },
  {
    treePosition: [30, 0, -2],
    monkeyPosition: [29.3, 2.45, -3]
  },
  {
    treePosition: [-24, 0, 16],
    monkeyPosition: [-24.9, 2.55, 15.2]
  },
  {
    treePosition: [-5, 0, 24],
    monkeyPosition: [-5.8, 2.4, 23.1]
  },
  {
    treePosition: [14, 0, 18],
    monkeyPosition: [13.3, 2.5, 17.2]
  },
  {
    treePosition: [31, 0, 12],
    monkeyPosition: [30.2, 2.45, 11]
  },
  {
    treePosition: [-18, 0, 32],
    monkeyPosition: [-18.9, 2.45, 31.2]
  },
  {
    treePosition: [20, 0, 31],
    monkeyPosition: [19.2, 2.45, 30.2]
  }
]

export const BOX_LAYOUTS: ICrateLayout[] = [
  {
    position: [-20, 0.9, -14],
    rotationY: 0.18,
    size: [2.4, 1.8, 2.1]
  },
  {
    position: [-7, 0.75, -18],
    rotationY: -0.42,
    size: [1.8, 1.5, 1.8]
  },
  {
    position: [8, 0.9, -16],
    rotationY: 0.3,
    size: [2.2, 1.8, 2.2]
  },
  {
    position: [22, 0.8, -10],
    rotationY: -0.2,
    size: [2, 1.6, 2]
  },
  {
    position: [-24, 0.9, 2],
    rotationY: -0.36,
    size: [2.4, 1.8, 2]
  },
  {
    position: [-9, 0.85, 6],
    rotationY: 0.52,
    size: [2.1, 1.7, 2.1]
  },
  {
    position: [6, 0.75, 4],
    rotationY: -0.18,
    size: [1.9, 1.5, 1.9]
  },
  {
    position: [24, 0.95, 5],
    rotationY: 0.66,
    size: [2.5, 1.9, 2.2]
  },
  {
    position: [-28, 0.8, 22],
    rotationY: 0.24,
    size: [2.1, 1.6, 1.9]
  },
  {
    position: [-10, 0.95, 28],
    rotationY: -0.48,
    size: [2.5, 1.9, 2.4]
  },
  {
    position: [9, 0.8, 24],
    rotationY: 0.16,
    size: [2, 1.6, 2]
  },
  {
    position: [27, 0.85, 26],
    rotationY: -0.28,
    size: [2.2, 1.7, 2.2]
  },
  {
    position: [-2.8, 0.85, -5.5],
    rotationY: 0,
    size: [2.2, 1.7, 2]
  },
  {
    position: [-0.2, 0.85, -5.5],
    rotationY: 0,
    size: [2.2, 1.7, 2]
  },
  {
    position: [2.4, 0.85, -5.5],
    rotationY: 0,
    size: [2.2, 1.7, 2]
  },
  {
    position: [5, 0.85, -5.5],
    rotationY: 0,
    size: [2.2, 1.7, 2]
  },
  {
    position: [-17.5, 0.85, 10.5],
    rotationY: 0.2,
    size: [2.1, 1.7, 2.1]
  },
  {
    position: [-17.5, 0.85, 13.1],
    rotationY: 0.2,
    size: [2.1, 1.7, 2.1]
  },
  {
    position: [-17.5, 0.85, 15.7],
    rotationY: 0.2,
    size: [2.1, 1.7, 2.1]
  },
  {
    position: [15.4, 0.8, 11.8],
    rotationY: 0.42,
    size: [2, 1.6, 2]
  },
  {
    position: [17.7, 0.8, 13.1],
    rotationY: 0.42,
    size: [2, 1.6, 2]
  },
  {
    position: [20, 0.8, 14.4],
    rotationY: 0.42,
    size: [2, 1.6, 2]
  },
  {
    position: [22.3, 0.8, 15.7],
    rotationY: 0.42,
    size: [2, 1.6, 2]
  },
  {
    position: [-30, 0.8, -15],
    rotationY: -0.24,
    size: [1.9, 1.5, 1.9]
  },
  {
    position: [-26.8, 0.8, -18.2],
    rotationY: 0.14,
    size: [2.1, 1.6, 1.9]
  },
  {
    position: [13.8, 0.95, -24],
    rotationY: -0.3,
    size: [2.4, 1.9, 2.3]
  },
  {
    position: [18.8, 0.85, -27.2],
    rotationY: 0.28,
    size: [2.2, 1.7, 2.1]
  },
  {
    position: [-4.5, 0.75, 15.5],
    rotationY: -0.18,
    size: [1.8, 1.5, 1.8]
  },
  {
    position: [-0.8, 0.95, 18.7],
    rotationY: 0.3,
    size: [2.4, 1.9, 2.2]
  },
  {
    position: [4.2, 0.8, 30.2],
    rotationY: 0.08,
    size: [2, 1.6, 2]
  },
  {
    position: [7, 0.8, 30.2],
    rotationY: 0.08,
    size: [2, 1.6, 2]
  },
  {
    position: [9.8, 0.8, 30.2],
    rotationY: 0.08,
    size: [2, 1.6, 2]
  }
]

const crateSizePresets: ICrateLayout['size'][] = [
  [1.8, 1.5, 1.8],
  [1.9, 1.5, 1.9],
  [2, 1.6, 2],
  [2.1, 1.7, 1.9],
  [2.1, 1.7, 2.1],
  [2.2, 1.7, 2],
  [2.2, 1.7, 2.2],
  [2.4, 1.8, 2],
  [2.4, 1.8, 2.1],
  [2.4, 1.9, 2.2],
  [2.4, 1.9, 2.3],
  [2.5, 1.9, 2.4]
]

const crateLayoutCount = BOX_LAYOUTS.length
const cratePlacementAttempts = 240
const crateFootprintPadding = 0.45
const cratePlacementMargin = 1.25
const crateStackHeightMax = 3
const playerStartCrateExclusionRadius = 6.5

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
  return Math.hypot(size[0], size[2]) / 2 + crateFootprintPadding
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
  const collisionRadius = playerStartCrateExclusionRadius + footprintRadius

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
    crateSizePresets[Math.floor(Math.random() * crateSizePresets.length)] ??
      crateSizePresets[0]
  )
  const stackHeight =
    1 +
    Math.floor(Math.random() * Math.min(crateStackHeightMax, remainingCrates))
  const rotationY = (Math.random() - 0.5) * Math.PI
  const footprintRadius = getCrateFootprintRadius(size)
  const spawnRange =
    GAME_ARENA_HALF_SIZE - footprintRadius - cratePlacementMargin

  for (
    let attemptIndex = 0;
    attemptIndex < cratePlacementAttempts;
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
  let remainingCrates = crateLayoutCount

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
