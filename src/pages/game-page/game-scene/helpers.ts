import { Vector3 } from 'three'
import {
  HEART_RESPAWN_SECONDS,
  TREE_LAYOUTS,
  TREE_TRUNK_COLLIDER_ARGS,
  type ICrateLayout
} from '../helpers'
import {
  arenaHalfSize,
  atmosphereParticleCount,
  hardcoreMonkeyFlightHeightMax,
  hardcoreMonkeyFlightHeightMin,
  heartPickupRadius,
  heartSpawnHeight,
  heartSpawnPlacementAttempts,
  playerJumpGravity,
  playerJumpVelocity,
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
  const positions = new Float32Array(atmosphereParticleCount * 3)
  const scales = new Float32Array(atmosphereParticleCount)

  for (let index = 0; index < atmosphereParticleCount; index += 1) {
    const positionOffset = index * 3

    positions[positionOffset] = (Math.random() - 0.5) * arenaHalfSize * 3.4
    positions[positionOffset + 1] = 1.4 + Math.random() * 11.5
    positions[positionOffset + 2] = (Math.random() - 0.5) * arenaHalfSize * 3.4
    scales[index] = 8 + Math.random() * 16
  }

  return { positions, scales }
}

export function clampToArena(value: number) {
  return Math.max(-arenaHalfSize, Math.min(arenaHalfSize, value))
}

export function isPointInsideTreeTrunk(point: Vector3) {
  return TREE_LAYOUTS.some(({ treePosition }) => {
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

export function createRandomMonkeyFlightPosition() {
  return new Vector3(
    clampToArena((Math.random() - 0.5) * arenaHalfSize * 2),
    hardcoreMonkeyFlightHeightMin +
      Math.random() *
        (hardcoreMonkeyFlightHeightMax - hardcoreMonkeyFlightHeightMin),
    clampToArena((Math.random() - 0.5) * arenaHalfSize * 2)
  )
}

export function createMonkeyState() {
  return TREE_LAYOUTS.map((layout, index) => ({
    active: true,
    animationOffset: index * 0.7,
    homePosition: new Vector3(...layout.monkeyPosition),
    nextThrowAt: 0,
    position: new Vector3(...layout.monkeyPosition),
    respawnAt: 0,
    rotationY: 0,
    targetPosition: createRandomMonkeyFlightPosition()
  }))
}

export function createRandomHeartPosition(crateLayouts: ICrateLayout[]) {
  const spawnRange = arenaHalfSize - heartPickupRadius

  for (
    let attemptIndex = 0;
    attemptIndex < heartSpawnPlacementAttempts;
    attemptIndex += 1
  ) {
    const position = new Vector3(
      (Math.random() - 0.5) * spawnRange * 2,
      heartSpawnHeight,
      (Math.random() - 0.5) * spawnRange * 2
    )

    if (
      !isPointInsideAnyCrate(
        [position.x, position.y, position.z],
        crateLayouts
      ) &&
      !isPointInsideTreeTrunk(position)
    ) {
      return position
    }
  }

  return new Vector3(0, heartSpawnHeight, 0)
}

export function createHeartState(crateLayouts: ICrateLayout[]) {
  const initialHeartIndex = Math.floor(Math.random() * TREE_LAYOUTS.length)

  return TREE_LAYOUTS.map((_, index) => {
    const isActive = index === initialHeartIndex

    return {
      active: isActive,
      animationOffset: index * 0.45,
      position: createRandomHeartPosition(crateLayouts),
      respawnAt: isActive ? 0 : Math.random() * HEART_RESPAWN_SECONDS
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

export const scenePlayerJumpGravity = playerJumpGravity
export const scenePlayerJumpVelocity = playerJumpVelocity
