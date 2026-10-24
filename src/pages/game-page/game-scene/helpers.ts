import { Vector3 } from 'three'
import {
  PAINKILLER_RESPAWN_SECONDS,
  TREE_TRUNK_COLLIDER_ARGS,
  type ICrateLayout,
  type ITreeLayout
} from '../helpers'
import {
  ARENA_BOUNDARY_COLLIDER_HEIGHT,
  ARENA_HALF_SIZE,
  ATMOSPHERE_PARTICLE_COUNT,
  CRATE_PLACEMENT_ATTEMPTS,
  ENEMY_EXPLOSION_PARTICLE_BASE_SCALE,
  ENEMY_EXPLOSION_PARTICLE_LIFETIME_SECONDS,
  ENEMY_EXPLOSION_PARTICLE_SPEED_MAX,
  ENEMY_EXPLOSION_PARTICLE_SPEED_MIN,
  ENEMY_EXPLOSION_PARTICLES_PER_BURST,
  FLOATING_COMBAT_TEXT_BASE_RISE_SPEED,
  FLOATING_COMBAT_TEXT_LIFETIME_SECONDS,
  FLOATING_COMBAT_TEXT_SIDE_JITTER,
  HARDCORE_ENEMY_FLIGHT_HEIGHT_MAX,
  HARDCORE_ENEMY_FLIGHT_HEIGHT_MIN,
  INTERIOR_ARENA_WALL_HEIGHT,
  INTERIOR_ARENA_WALL_SEGMENTS,
  INTERIOR_ARENA_WALL_THICKNESS,
  PAINKILLER_PICKUP_RADIUS,
  PAINKILLER_SPAWN_HEIGHT,
  PAINKILLER_SPAWN_PLACEMENT_ATTEMPTS,
  TNT_BOX_COUNT,
  TNT_BOX_SIZE,
  TNT_BOX_SPAWN_PLACEMENT_ATTEMPTS,
  PLAYER_START_CRATE_EXCLUSION_RADIUS,
  PLAYER_START_POSITION,
  type TDifficultyLevel,
  type TGameControl
} from '../settings'
import {
  doesCircleIntersectAnyCrate,
  isPointInsideAnyCrate
} from '../world-collision'
import type {
  IControlsState,
  IEnemyState,
  IEnemyExplosionParticleState,
  IFloatingCombatTextState,
  ITntBoxState,
  IProjectileState,
  TFloatingCombatTextSource,
  TProjectileOwner,
  TWeapon,
  TTreeVariant
} from './types'

interface IAtmosphereParticleData {
  positions: Float32Array
  scales: Float32Array
}

export function createLookDirection(yaw: number, pitch: number) {
  const cosPitch = Math.cos(pitch)

  return new Vector3(
    Math.sin(yaw) * cosPitch,
    Math.sin(pitch),
    -Math.cos(yaw) * cosPitch
  ).normalize()
}

export function createProjectileState(): IProjectileState {
  return {
    active: false,
    owner: 'player',
    position: new Vector3(),
    weapon: 'axe',
    ttl: 0,
    velocity: new Vector3()
  }
}

export function createFloatingCombatTextState(): IFloatingCombatTextState {
  return {
    active: false,
    maxTtl: 0,
    position: new Vector3(),
    source: 'enemy',
    ttl: 0,
    value: 0,
    velocity: new Vector3()
  }
}

export function resetFloatingCombatTextState(
  floatingCombatTextState: IFloatingCombatTextState
) {
  floatingCombatTextState.active = false
  floatingCombatTextState.maxTtl = 0
  floatingCombatTextState.position.set(0, 0, 0)
  floatingCombatTextState.source = 'enemy'
  floatingCombatTextState.ttl = 0
  floatingCombatTextState.value = 0
  floatingCombatTextState.velocity.set(0, 0, 0)
}

interface ISpawnFloatingCombatText {
  source: TFloatingCombatTextSource
  value: number
}

export function spawnFloatingCombatText(
  floatingCombatTextStates: IFloatingCombatTextState[],
  { source, value }: ISpawnFloatingCombatText
) {
  if (value === 0) {
    return
  }

  const floatingCombatTextState =
    floatingCombatTextStates.find((candidate) => !candidate.active) ??
    floatingCombatTextStates[0]

  if (!floatingCombatTextState) {
    return
  }

  floatingCombatTextState.active = true
  floatingCombatTextState.maxTtl = FLOATING_COMBAT_TEXT_LIFETIME_SECONDS
  floatingCombatTextState.ttl = FLOATING_COMBAT_TEXT_LIFETIME_SECONDS
  floatingCombatTextState.position.set(0, 0, 0)
  floatingCombatTextState.source = source
  floatingCombatTextState.value = Math.round(value)
  floatingCombatTextState.velocity.set(
    (Math.random() - 0.5) * FLOATING_COMBAT_TEXT_SIDE_JITTER,
    FLOATING_COMBAT_TEXT_BASE_RISE_SPEED + Math.random() * 0.75,
    (Math.random() - 0.5) * FLOATING_COMBAT_TEXT_SIDE_JITTER
  )
}

export function updateFloatingCombatTextStates(
  floatingCombatTextStates: IFloatingCombatTextState[],
  delta: number
) {
  for (const floatingCombatTextState of floatingCombatTextStates) {
    if (!floatingCombatTextState.active) {
      continue
    }

    floatingCombatTextState.ttl -= delta

    if (floatingCombatTextState.ttl <= 0) {
      resetFloatingCombatTextState(floatingCombatTextState)
      continue
    }

    floatingCombatTextState.position.addScaledVector(
      floatingCombatTextState.velocity,
      delta
    )
    floatingCombatTextState.velocity.x *= 0.92
    floatingCombatTextState.velocity.z *= 0.92
  }
}

export function formatFloatingCombatTextValue(value: number) {
  const roundedValue = Math.round(value)

  if (roundedValue > 0) {
    return `+${roundedValue}`
  }

  return String(roundedValue)
}

export function resetProjectileState(projectile: IProjectileState) {
  projectile.active = false
  projectile.weapon = 'axe'
  projectile.ttl = 0
  projectile.position.set(0, 0, 0)
  projectile.velocity.set(0, 0, 0)
}

export function createAtmosphereParticleData(): IAtmosphereParticleData {
  const positions = new Float32Array(ATMOSPHERE_PARTICLE_COUNT * 3)
  const scales = new Float32Array(ATMOSPHERE_PARTICLE_COUNT)

  for (let index = 0; index < ATMOSPHERE_PARTICLE_COUNT; index += 1) {
    const positionOffset = index * 3

    positions[positionOffset] = (Math.random() - 0.5) * ARENA_HALF_SIZE * 3.4
    positions[positionOffset + 1] = 1.4 + Math.random() * 11.5
    positions[positionOffset + 2] =
      (Math.random() - 0.5) * ARENA_HALF_SIZE * 3.4
    scales[index] = 8 + Math.random() * 16
  }

  return { positions, scales }
}

export function clampToArena(value: number) {
  return Math.max(-ARENA_HALF_SIZE, Math.min(ARENA_HALF_SIZE, value))
}

export function isPointInsideTreeTrunk(
  point: Vector3,
  treeLayouts: ITreeLayout[]
) {
  const trunkPadding = 0.08

  return treeLayouts.some(({ treePosition }) => {
    const trunkCenterY = treePosition[1] + TREE_TRUNK_COLLIDER_ARGS[1]
    const deltaX = Math.abs(point.x - treePosition[0])
    const deltaY = Math.abs(point.y - trunkCenterY)
    const deltaZ = Math.abs(point.z - treePosition[2])

    return (
      deltaX <= TREE_TRUNK_COLLIDER_ARGS[0] + trunkPadding &&
      deltaY <= TREE_TRUNK_COLLIDER_ARGS[1] + trunkPadding &&
      deltaZ <= TREE_TRUNK_COLLIDER_ARGS[2] + trunkPadding
    )
  })
}

export function isPointInsideArenaWall(point: Vector3, padding = 0) {
  if (
    point.y < 0 ||
    point.y >
      Math.max(ARENA_BOUNDARY_COLLIDER_HEIGHT, INTERIOR_ARENA_WALL_HEIGHT)
  ) {
    return false
  }

  // Boundary colliders are centered outside the playable area, so the inner face
  // starts at ARENA_HALF_SIZE. Treat points beyond that face as blocked.
  const innerBoundary = ARENA_HALF_SIZE - padding

  if (
    Math.abs(point.x) >= innerBoundary ||
    Math.abs(point.z) >= innerBoundary
  ) {
    return true
  }

  return INTERIOR_ARENA_WALL_SEGMENTS.some((segment) => {
    const halfLength = segment.length / 2 + padding
    const halfThickness = INTERIOR_ARENA_WALL_THICKNESS / 2 + padding
    const localX = Math.abs(point.x - segment.center[0])
    const localZ = Math.abs(point.z - segment.center[1])

    return segment.axis === 'x'
      ? localX <= halfLength && localZ <= halfThickness
      : localX <= halfThickness && localZ <= halfLength
  })
}

interface IProjectileObstaclePathCheck {
  crateLayouts?: ICrateLayout[]
  nextPosition: Vector3
  previousPosition: Vector3
  treeLayouts: ITreeLayout[]
}

export function doesProjectilePathHitObstacle({
  crateLayouts = [],
  nextPosition,
  previousPosition,
  treeLayouts
}: IProjectileObstaclePathCheck) {
  const travelDistance = previousPosition.distanceTo(nextPosition)
  const sampleCount = Math.max(1, Math.ceil(travelDistance / 0.24))
  const samplePoint = new Vector3()

  for (let sampleIndex = 0; sampleIndex <= sampleCount; sampleIndex += 1) {
    const alpha = sampleIndex / sampleCount

    samplePoint.lerpVectors(previousPosition, nextPosition, alpha)

    if (
      isPointInsideArenaWall(samplePoint) ||
      isPointInsideAnyCrate(
        [samplePoint.x, samplePoint.y, samplePoint.z],
        crateLayouts
      ) ||
      isPointInsideTreeTrunk(samplePoint, treeLayouts)
    ) {
      return true
    }
  }

  return false
}

export function createRandomEnemyFlightPosition() {
  return new Vector3(
    clampToArena((Math.random() - 0.5) * ARENA_HALF_SIZE * 2),
    HARDCORE_ENEMY_FLIGHT_HEIGHT_MIN +
      Math.random() *
        (HARDCORE_ENEMY_FLIGHT_HEIGHT_MAX - HARDCORE_ENEMY_FLIGHT_HEIGHT_MIN),
    clampToArena((Math.random() - 0.5) * ARENA_HALF_SIZE * 2)
  )
}

function isEnemySpawnBlocked(
  position: Vector3,
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[]
) {
  const deltaX = position.x - PLAYER_START_POSITION[0]
  const deltaZ = position.z - PLAYER_START_POSITION[2]
  const exclusionRadius = PLAYER_START_CRATE_EXCLUSION_RADIUS + 1.1

  if (deltaX * deltaX + deltaZ * deltaZ <= exclusionRadius * exclusionRadius) {
    return true
  }

  return (
    isPointInsideAnyCrate([position.x, position.y, position.z], crateLayouts) ||
    isPointInsideTreeTrunk(position, treeLayouts)
  )
}

function createRandomEnemySpawnPosition(
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[]
) {
  for (
    let attemptIndex = 0;
    attemptIndex < CRATE_PLACEMENT_ATTEMPTS;
    attemptIndex += 1
  ) {
    const position = createRandomEnemyFlightPosition()

    if (!isEnemySpawnBlocked(position, crateLayouts, treeLayouts)) {
      return position
    }
  }

  return createRandomEnemyFlightPosition()
}

export function createEnemyState(
  enemyCount: number,
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[]
): IEnemyState[] {
  return Array.from({ length: enemyCount }, (_, index) => {
    const spawnPosition = createRandomEnemySpawnPosition(
      crateLayouts,
      treeLayouts
    )

    return {
      active: true,
      animationOffset: index * 0.7,
      homePosition: spawnPosition.clone(),
      nextThrowAt: 0,
      position: spawnPosition,
      respawnAt: 0,
      rotationY: 0,
      targetPosition: createRandomEnemyFlightPosition()
    }
  })
}

export function resetEnemyForDifficulty(
  enemyState: IEnemyState,
  difficulty: TDifficultyLevel,
  nextThrowAt: number
) {
  enemyState.active = true

  switch (difficulty) {
    case 'Hardcore':
      enemyState.position.copy(createRandomEnemyFlightPosition())
      enemyState.targetPosition.copy(createRandomEnemyFlightPosition())
      break
    default:
      enemyState.position.copy(enemyState.homePosition)
      break
  }

  enemyState.nextThrowAt = nextThrowAt
}

export function createEnemyExplosionParticleState(): IEnemyExplosionParticleState {
  return createExplosionParticleState()
}

export function createExplosionParticleState(): IEnemyExplosionParticleState {
  return {
    active: false,
    maxTtl: 0,
    position: new Vector3(),
    scale: ENEMY_EXPLOSION_PARTICLE_BASE_SCALE,
    ttl: 0,
    velocity: new Vector3()
  }
}

export function resetEnemyExplosionParticleState(
  particleState: IEnemyExplosionParticleState
) {
  resetExplosionParticleState(particleState)
}

export function resetExplosionParticleState(
  particleState: IEnemyExplosionParticleState
) {
  particleState.active = false
  particleState.maxTtl = 0
  particleState.position.set(0, 0, 0)
  particleState.scale = ENEMY_EXPLOSION_PARTICLE_BASE_SCALE
  particleState.ttl = 0
  particleState.velocity.set(0, 0, 0)
}

export function spawnEnemyExplosionParticles(
  particleStates: IEnemyExplosionParticleState[],
  origin: Vector3,
  particleCount: number = ENEMY_EXPLOSION_PARTICLES_PER_BURST
) {
  spawnExplosionParticles(particleStates, origin, particleCount)
}

export function spawnExplosionParticles(
  particleStates: IEnemyExplosionParticleState[],
  origin: Vector3,
  particleCount: number = ENEMY_EXPLOSION_PARTICLES_PER_BURST
) {
  let spawnedCount = 0

  for (const particleState of particleStates) {
    if (spawnedCount >= particleCount) {
      return
    }

    if (particleState.active) {
      continue
    }

    const angle = Math.random() * Math.PI * 2
    const tilt = Math.random() * Math.PI * 0.65 - Math.PI * 0.2
    const speed =
      ENEMY_EXPLOSION_PARTICLE_SPEED_MIN +
      Math.random() *
        (ENEMY_EXPLOSION_PARTICLE_SPEED_MAX -
          ENEMY_EXPLOSION_PARTICLE_SPEED_MIN)
    const spread = 0.8 + Math.random() * 0.9

    particleState.active = true
    particleState.maxTtl = ENEMY_EXPLOSION_PARTICLE_LIFETIME_SECONDS
    particleState.ttl = particleState.maxTtl
    particleState.scale =
      ENEMY_EXPLOSION_PARTICLE_BASE_SCALE * (0.7 + Math.random() * 0.8)
    particleState.position.copy(origin)
    particleState.velocity.set(
      Math.cos(angle) * Math.cos(tilt) * speed * spread,
      Math.sin(tilt) * speed + 2.2,
      Math.sin(angle) * Math.cos(tilt) * speed * spread
    )

    spawnedCount += 1
  }
}

function getTntFootprintRadius() {
  return Math.hypot(TNT_BOX_SIZE[0], TNT_BOX_SIZE[2]) / 2 + 0.25
}

function doesTntPositionOverlapPlayerStart(
  positionX: number,
  positionZ: number,
  footprintRadius: number
) {
  const deltaX = positionX - PLAYER_START_POSITION[0]
  const deltaZ = positionZ - PLAYER_START_POSITION[2]
  const collisionRadius = PLAYER_START_CRATE_EXCLUSION_RADIUS + footprintRadius

  return deltaX * deltaX + deltaZ * deltaZ <= collisionRadius * collisionRadius
}

function doesTntPositionOverlapTree(
  positionX: number,
  positionZ: number,
  footprintRadius: number,
  treeLayouts: ITreeLayout[]
) {
  const treeCollisionRadius =
    Math.max(TREE_TRUNK_COLLIDER_ARGS[0], TREE_TRUNK_COLLIDER_ARGS[2]) +
    footprintRadius +
    0.45

  return treeLayouts.some(({ treePosition }) => {
    const deltaX = positionX - treePosition[0]
    const deltaZ = positionZ - treePosition[2]

    return (
      deltaX * deltaX + deltaZ * deltaZ <=
      treeCollisionRadius * treeCollisionRadius
    )
  })
}

function doesTntPositionOverlapExistingTnt(
  positionX: number,
  positionZ: number,
  footprintRadius: number,
  existingPositions: Vector3[]
) {
  return existingPositions.some((position) => {
    const deltaX = positionX - position.x
    const deltaZ = positionZ - position.z
    const collisionRadius = footprintRadius * 2 + 0.25

    return (
      deltaX * deltaX + deltaZ * deltaZ <= collisionRadius * collisionRadius
    )
  })
}

export function createRandomTntPosition(
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[],
  existingPositions: Vector3[] = []
) {
  const footprintRadius = getTntFootprintRadius()
  const spawnRange = ARENA_HALF_SIZE - footprintRadius - 0.8

  for (
    let attemptIndex = 0;
    attemptIndex < TNT_BOX_SPAWN_PLACEMENT_ATTEMPTS;
    attemptIndex += 1
  ) {
    const positionX = (Math.random() - 0.5) * spawnRange * 2
    const positionZ = (Math.random() - 0.5) * spawnRange * 2

    if (
      doesCircleIntersectAnyCrate(
        { x: positionX, z: positionZ },
        footprintRadius,
        crateLayouts,
        0.1
      ) ||
      doesTntPositionOverlapTree(
        positionX,
        positionZ,
        footprintRadius,
        treeLayouts
      ) ||
      doesTntPositionOverlapPlayerStart(
        positionX,
        positionZ,
        footprintRadius
      ) ||
      doesTntPositionOverlapExistingTnt(
        positionX,
        positionZ,
        footprintRadius,
        existingPositions
      )
    ) {
      continue
    }

    return new Vector3(positionX, TNT_BOX_SIZE[1] / 2, positionZ)
  }

  return null
}

export function createTntState(
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[]
): ITntBoxState[] {
  const tntStates: ITntBoxState[] = []
  const existingPositions: Vector3[] = []

  for (let index = 0; index < TNT_BOX_COUNT; index += 1) {
    const position = createRandomTntPosition(
      crateLayouts,
      treeLayouts,
      existingPositions
    )

    if (!position) {
      break
    }

    existingPositions.push(position.clone())
    tntStates.push({
      active: true,
      position
    })
  }

  return tntStates
}

export function createRandomPainkillerPosition(
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[] = []
) {
  const spawnRange = ARENA_HALF_SIZE - PAINKILLER_PICKUP_RADIUS

  for (
    let attemptIndex = 0;
    attemptIndex < PAINKILLER_SPAWN_PLACEMENT_ATTEMPTS;
    attemptIndex += 1
  ) {
    const position = new Vector3(
      (Math.random() - 0.5) * spawnRange * 2,
      PAINKILLER_SPAWN_HEIGHT,
      (Math.random() - 0.5) * spawnRange * 2
    )

    if (
      !isPointInsideAnyCrate(
        [position.x, position.y, position.z],
        crateLayouts
      ) &&
      !isPointInsideTreeTrunk(position, treeLayouts)
    ) {
      return position
    }
  }

  return new Vector3(0, PAINKILLER_SPAWN_HEIGHT, 0)
}

export function createPainkillerState(
  crateLayouts: ICrateLayout[],
  treeLayouts: ITreeLayout[]
) {
  const initialPainkillerIndex = Math.floor(Math.random() * treeLayouts.length)

  return treeLayouts.map((_, index) => {
    const isActive = index === initialPainkillerIndex

    return {
      active: isActive,
      animationOffset: index * 0.45,
      position: createRandomPainkillerPosition(crateLayouts, treeLayouts),
      respawnAt: isActive ? 0 : Math.random() * PAINKILLER_RESPAWN_SECONDS
    }
  })
}

export function getTreeVariant(index: number): TTreeVariant {
  switch (index % 3) {
    case 0:
      return 0
    case 1:
      return 1
    default:
      return 2
  }
}

export function syncControlsState(
  controls: IControlsState,
  keyboardState: Record<TGameControl, boolean>
) {
  controls.forward = keyboardState.forward
  controls.backward = keyboardState.backward
  controls.left = keyboardState.left
  controls.right = keyboardState.right
}

export function resetControlsState(controls: IControlsState) {
  controls.forward = false
  controls.backward = false
  controls.left = false
  controls.right = false
}

export function spawnProjectileIntoPool(
  projectiles: IProjectileState[],
  origin: Vector3,
  velocity: Vector3,
  owner: TProjectileOwner,
  ttl: number,
  weapon: TWeapon = 'axe'
) {
  const projectile = projectiles.find((candidate) => !candidate.active)

  if (!projectile) {
    return
  }

  projectile.active = true
  projectile.owner = owner
  projectile.weapon = weapon
  projectile.position.copy(origin)
  projectile.velocity.copy(velocity)
  projectile.ttl = ttl
}
