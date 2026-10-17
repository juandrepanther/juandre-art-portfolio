import { Vector3 } from 'three'
import {
  PAINKILLER_RESPAWN_SECONDS,
  TREE_TRUNK_COLLIDER_ARGS,
  type ICrateLayout,
  type ITreeLayout
} from '../helpers'
import {
  ARENA_HALF_SIZE,
  ATMOSPHERE_PARTICLE_COUNT,
  HARDCORE_ENEMY_FLIGHT_HEIGHT_MAX,
  HARDCORE_ENEMY_FLIGHT_HEIGHT_MIN,
  PAINKILLER_PICKUP_RADIUS,
  PAINKILLER_SPAWN_HEIGHT,
  PAINKILLER_SPAWN_PLACEMENT_ATTEMPTS,
  type TGameControl
} from '../settings'
import { isPointInsideAnyCrate } from '../world-collision'
import type {
  IControlsState,
  IProjectileState,
  TProjectileOwner,
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
    ttl: 0,
    velocity: new Vector3()
  }
}

export function resetProjectileState(projectile: IProjectileState) {
  projectile.active = false
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
  return treeLayouts.some(({ treePosition }) => {
    const deltaX = Math.abs(point.x - treePosition[0])
    const deltaZ = Math.abs(point.z - treePosition[2])

    return (
      deltaX <= TREE_TRUNK_COLLIDER_ARGS[0] + 0.08 &&
      deltaZ <= TREE_TRUNK_COLLIDER_ARGS[2] + 0.08 &&
      point.y >= 0 &&
      point.y <= TREE_TRUNK_COLLIDER_ARGS[1] * 2 + 0.2
    )
  })
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

export function createEnemyState(treeLayouts: ITreeLayout[]) {
  return treeLayouts.map((layout, index) => ({
    active: true,
    animationOffset: index * 0.7,
    homePosition: new Vector3(...layout.enemyPosition),
    nextThrowAt: 0,
    position: new Vector3(...layout.enemyPosition),
    respawnAt: 0,
    rotationY: 0,
    targetPosition: createRandomEnemyFlightPosition()
  }))
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
  ttl: number
) {
  const projectile = projectiles.find((candidate) => !candidate.active)

  if (!projectile) {
    return
  }

  projectile.active = true
  projectile.owner = owner
  projectile.position.copy(origin)
  projectile.velocity.copy(velocity)
  projectile.ttl = ttl
}
