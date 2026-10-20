import {
  CRATE_COMBINATION_BOX_MAX,
  CRATE_COMBINATION_BOX_MIN,
  CRATE_COMBINATION_SPACING,
  CRATE_COMBINATION_STACK_CHANCE,
  CRATE_FOOTPRINT_PADDING,
  CRATE_LAYOUT_COUNT,
  CRATE_PLACEMENT_ATTEMPTS,
  CRATE_PLACEMENT_MARGIN,
  CRATE_SIZE_PRESETS,
  CRATE_STACK_HEIGHT_MAX,
  GAME_ARENA_HALF_SIZE,
  PLAYER_START_CRATE_EXCLUSION_RADIUS,
  PLAYER_START_POSITION,
  TREE_LAYOUT_COUNT,
  TREE_TRUNK_COLLIDER_ARGS
} from './settings'

export type TWorldPosition = [number, number, number]

export interface ITreeLayout {
  enemyPosition: TWorldPosition
  treePosition: TWorldPosition
}

export interface ICrateLayout {
  position: TWorldPosition
  rotationY: number
  size: [number, number, number]
  combinationId?: number
}

interface ICrateCombinationLayout {
  anchorX: number
  anchorZ: number
  combinationId: number
  crateCount: number
  localLayouts: ICrateLocalLayout[]
  rotationY: number
  size: ICrateLayout['size']
}

interface ICrateLocalLayout {
  level: number
  offsetX: number
  offsetZ: number
}

type TCratePattern =
  | 'line'
  | 'corner'
  | 'zigzag'
  | 'diamond'
  | 'cross'
  | 'staggered'

const CRATE_PATTERN_POINTS: Record<TCratePattern, [number, number][]> = {
  line: [
    [0, 0],
    [1, 0],
    [-1, 0],
    [2, 0],
    [-2, 0],
    [3, 0],
    [-3, 0]
  ],
  corner: [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [2, 1]
  ],
  zigzag: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 2],
    [3, 3]
  ],
  diamond: [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, -1]
  ],
  cross: [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [2, 0],
    [0, 2]
  ],
  staggered: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
}

function cloneCrateSize(size: ICrateLayout['size']): ICrateLayout['size'] {
  return [size[0], size[1], size[2]]
}

function cloneCrateLayout(crateLayout: ICrateLayout): ICrateLayout {
  return {
    combinationId: crateLayout.combinationId,
    position: [
      crateLayout.position[0],
      crateLayout.position[1],
      crateLayout.position[2]
    ],
    rotationY: crateLayout.rotationY,
    size: cloneCrateSize(crateLayout.size)
  }
}

function cloneTreeLayout(treeLayout: ITreeLayout): ITreeLayout {
  return {
    enemyPosition: [
      treeLayout.enemyPosition[0],
      treeLayout.enemyPosition[1],
      treeLayout.enemyPosition[2]
    ],
    treePosition: [
      treeLayout.treePosition[0],
      treeLayout.treePosition[1],
      treeLayout.treePosition[2]
    ]
  }
}

function getCrateFootprintRadius(size: ICrateLayout['size']) {
  return Math.hypot(size[0], size[2]) / 2 + CRATE_FOOTPRINT_PADDING
}

function getTreeFootprintRadius() {
  return (
    Math.max(TREE_TRUNK_COLLIDER_ARGS[0], TREE_TRUNK_COLLIDER_ARGS[2]) + 2.25
  )
}

function doesTreeOverlapExistingTrees(
  positionX: number,
  positionZ: number,
  existingTrees: ITreeLayout[]
) {
  const treeCollisionRadius = getTreeFootprintRadius()

  return existingTrees.some(({ treePosition }) => {
    const deltaX = positionX - treePosition[0]
    const deltaZ = positionZ - treePosition[2]

    return (
      deltaX * deltaX + deltaZ * deltaZ <=
      treeCollisionRadius * treeCollisionRadius
    )
  })
}

function doesTreeOverlapPlayerStart(
  positionX: number,
  positionZ: number,
  footprintRadius: number
) {
  const deltaX = positionX - PLAYER_START_POSITION[0]
  const deltaZ = positionZ - PLAYER_START_POSITION[2]
  const collisionRadius = PLAYER_START_CRATE_EXCLUSION_RADIUS + footprintRadius

  return deltaX * deltaX + deltaZ * deltaZ <= collisionRadius * collisionRadius
}

function createTreeEnemyPosition(
  positionX: number,
  positionZ: number
): TWorldPosition {
  const angle = Math.random() * Math.PI * 2
  const radius = 0.95 + Math.random() * 0.55
  const height = 2.25 + Math.random() * 0.45

  return [
    positionX + Math.cos(angle) * radius,
    height,
    positionZ + Math.sin(angle) * radius
  ]
}

function createRandomTreeStack(existingTrees: ITreeLayout[]) {
  const footprintRadius = getTreeFootprintRadius()
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
      doesTreeOverlapExistingTrees(positionX, positionZ, existingTrees) ||
      doesTreeOverlapPlayerStart(positionX, positionZ, footprintRadius)
    ) {
      continue
    }

    return {
      enemyPosition: createTreeEnemyPosition(positionX, positionZ),
      treePosition: [positionX, 0, positionZ] as TWorldPosition
    }
  }

  return null
}

export function createRandomTreeLayouts(): ITreeLayout[] {
  const treeLayouts: ITreeLayout[] = []

  while (treeLayouts.length < TREE_LAYOUT_COUNT) {
    const treeLayout = createRandomTreeStack(treeLayouts)

    if (!treeLayout) {
      return treeLayouts.map(cloneTreeLayout)
    }

    treeLayouts.push(treeLayout)
  }

  return treeLayouts.map(cloneTreeLayout)
}

function doesCrateOverlapTrees(
  positionX: number,
  positionZ: number,
  footprintRadius: number,
  treeLayouts: ITreeLayout[]
) {
  const treeCollisionRadius =
    Math.max(TREE_TRUNK_COLLIDER_ARGS[0], TREE_TRUNK_COLLIDER_ARGS[2]) +
    footprintRadius

  return treeLayouts.some(({ treePosition }) => {
    const deltaX = positionX - treePosition[0]
    const deltaZ = positionZ - treePosition[2]

    return (
      deltaX * deltaX + deltaZ * deltaZ <=
      treeCollisionRadius * treeCollisionRadius
    )
  })
}

function doesCrateOverlapPlayerStart(
  positionX: number,
  positionZ: number,
  footprintRadius: number
) {
  const deltaX = positionX - PLAYER_START_POSITION[0]
  const deltaZ = positionZ - PLAYER_START_POSITION[2]
  const collisionRadius = PLAYER_START_CRATE_EXCLUSION_RADIUS + footprintRadius

  return deltaX * deltaX + deltaZ * deltaZ <= collisionRadius * collisionRadius
}

function doesCrateOverlapOtherCrates(
  positionX: number,
  positionZ: number,
  footprintRadius: number,
  crateLayouts: ICrateLayout[]
) {
  return crateLayouts.some((crateLayout) => {
    const deltaX = positionX - crateLayout.position[0]
    const deltaZ = positionZ - crateLayout.position[2]
    const collisionRadius =
      footprintRadius + getCrateFootprintRadius(crateLayout.size)

    return (
      deltaX * deltaX + deltaZ * deltaZ <= collisionRadius * collisionRadius
    )
  })
}

function shuffleCratePoints(cratePoints: [number, number][]) {
  const shuffledPoints = [...cratePoints]

  for (
    let pointIndex = shuffledPoints.length - 1;
    pointIndex > 0;
    pointIndex -= 1
  ) {
    const swapIndex = Math.floor(Math.random() * (pointIndex + 1))
    const currentPoint = shuffledPoints[pointIndex]
    shuffledPoints[pointIndex] = shuffledPoints[swapIndex] ?? currentPoint
    shuffledPoints[swapIndex] = currentPoint
  }

  return shuffledPoints
}

function pickCratePattern(): TCratePattern {
  const patternKeys = Object.keys(CRATE_PATTERN_POINTS) as TCratePattern[]
  const patternIndex = Math.floor(Math.random() * patternKeys.length)

  return patternKeys[patternIndex] ?? patternKeys[0]
}

function createLocalCrateLayouts(
  crateCount: number,
  size: ICrateLayout['size']
): ICrateLocalLayout[] {
  const spacing = Math.max(size[0], size[2]) + CRATE_COMBINATION_SPACING
  const pattern = pickCratePattern()
  const patternPoints = shuffleCratePoints(CRATE_PATTERN_POINTS[pattern])
  const shouldIntroduceStacking =
    crateCount > 1 && Math.random() < CRATE_COMBINATION_STACK_CHANCE
  const basePointCount = shouldIntroduceStacking
    ? Math.max(1, crateCount - Math.min(2, crateCount - 1))
    : crateCount
  const selectedPoints = patternPoints.slice(0, basePointCount)
  const pointHeights = Array.from({ length: selectedPoints.length }, () => 1)
  let remainingStackedCrates = crateCount - basePointCount

  while (remainingStackedCrates > 0 && selectedPoints.length > 0) {
    const pointIndex = Math.floor(Math.random() * selectedPoints.length)

    if ((pointHeights[pointIndex] ?? 0) >= CRATE_STACK_HEIGHT_MAX) {
      continue
    }

    pointHeights[pointIndex] = (pointHeights[pointIndex] ?? 0) + 1
    remainingStackedCrates -= 1
  }

  return selectedPoints.flatMap(([pointX, pointZ], pointIndex) => {
    const levels = pointHeights[pointIndex] ?? 1

    return Array.from({ length: levels }, (_, level) => ({
      level,
      offsetX: pointX * spacing,
      offsetZ: pointZ * spacing
    }))
  })
}

function getCrateCombinationRadius(
  localLayouts: ICrateLocalLayout[],
  size: ICrateLayout['size']
) {
  const footprintRadius = getCrateFootprintRadius(size)

  return localLayouts.reduce((largestRadius, localLayout) => {
    const localRadius =
      Math.hypot(localLayout.offsetX, localLayout.offsetZ) + footprintRadius

    return Math.max(largestRadius, localRadius)
  }, footprintRadius)
}

function createCrateLayoutsFromCombination(
  crateCombinationLayout: ICrateCombinationLayout
) {
  const [crateWidth, crateHeight, crateDepth] = crateCombinationLayout.size
  const cosY = Math.cos(crateCombinationLayout.rotationY)
  const sinY = Math.sin(crateCombinationLayout.rotationY)

  return crateCombinationLayout.localLayouts.map((localLayout) => {
    const worldOffsetX = localLayout.offsetX * cosY - localLayout.offsetZ * sinY
    const worldOffsetZ = localLayout.offsetX * sinY + localLayout.offsetZ * cosY

    return {
      combinationId: crateCombinationLayout.combinationId,
      position: [
        crateCombinationLayout.anchorX + worldOffsetX,
        crateHeight / 2 + localLayout.level * crateHeight,
        crateCombinationLayout.anchorZ + worldOffsetZ
      ] as TWorldPosition,
      rotationY: crateCombinationLayout.rotationY,
      size: [crateWidth, crateHeight, crateDepth] as ICrateLayout['size']
    }
  })
}

function createRandomCrateCombination(
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[],
  remainingCrates: number,
  combinationId: number
) {
  const size = cloneCrateSize(
    CRATE_SIZE_PRESETS[Math.floor(Math.random() * CRATE_SIZE_PRESETS.length)] ??
      CRATE_SIZE_PRESETS[0]
  )
  const maxCombinationCrates = Math.min(
    remainingCrates,
    CRATE_COMBINATION_BOX_MAX
  )
  const minCombinationCrates = Math.min(
    CRATE_COMBINATION_BOX_MIN,
    maxCombinationCrates
  )
  const crateCount =
    minCombinationCrates +
    Math.floor(
      Math.random() * (maxCombinationCrates - minCombinationCrates + 1)
    )
  const localLayouts = createLocalCrateLayouts(crateCount, size)
  const rotationY = (Math.random() - 0.5) * Math.PI
  const combinationRadius = getCrateCombinationRadius(localLayouts, size)
  const spawnRange =
    GAME_ARENA_HALF_SIZE - combinationRadius - CRATE_PLACEMENT_MARGIN

  for (
    let attemptIndex = 0;
    attemptIndex < CRATE_PLACEMENT_ATTEMPTS;
    attemptIndex += 1
  ) {
    const anchorX = (Math.random() - 0.5) * spawnRange * 2
    const anchorZ = (Math.random() - 0.5) * spawnRange * 2
    const crateCombinationLayout: ICrateCombinationLayout = {
      anchorX,
      anchorZ,
      combinationId,
      crateCount,
      localLayouts,
      rotationY,
      size
    }
    const candidateCrateLayouts = createCrateLayoutsFromCombination(
      crateCombinationLayout
    )
    const hasOverlap = candidateCrateLayouts.some((crateLayout) => {
      const footprintRadius = getCrateFootprintRadius(crateLayout.size)
      const positionX = crateLayout.position[0]
      const positionZ = crateLayout.position[2]

      return (
        doesCrateOverlapTrees(
          positionX,
          positionZ,
          footprintRadius,
          treeLayouts
        ) ||
        doesCrateOverlapPlayerStart(positionX, positionZ, footprintRadius) ||
        doesCrateOverlapOtherCrates(
          positionX,
          positionZ,
          footprintRadius,
          crateLayouts
        )
      )
    })

    if (hasOverlap) {
      continue
    }

    return candidateCrateLayouts
  }

  return null
}

function cloneCrateLayouts(crateLayouts: ICrateLayout[]) {
  return crateLayouts.map(cloneCrateLayout)
}

export function createRandomBoxLayouts(
  treeLayouts: ITreeLayout[]
): ICrateLayout[] {
  let bestCrateLayouts: ICrateLayout[] = []

  for (
    let generationAttempt = 0;
    generationAttempt < CRATE_PLACEMENT_ATTEMPTS;
    generationAttempt += 1
  ) {
    const crateLayouts: ICrateLayout[] = []
    let remainingCrates = CRATE_LAYOUT_COUNT
    let nextCombinationId = 0

    while (remainingCrates > 0) {
      const crateCombinationLayout = createRandomCrateCombination(
        crateLayouts,
        treeLayouts,
        remainingCrates,
        nextCombinationId
      )

      if (!crateCombinationLayout) {
        break
      }

      crateLayouts.push(...crateCombinationLayout)
      remainingCrates -= crateCombinationLayout.length
      nextCombinationId += 1
    }

    if (remainingCrates === 0) {
      return cloneCrateLayouts(crateLayouts)
    }

    if (crateLayouts.length > bestCrateLayouts.length) {
      bestCrateLayouts = cloneCrateLayouts(crateLayouts)
    }
  }

  return cloneCrateLayouts(bestCrateLayouts)
}
