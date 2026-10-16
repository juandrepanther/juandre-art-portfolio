import type { KeyboardControlsEntry } from '@react-three/drei'
import { Vector3 } from 'three'
import { GAME_ARENA_HALF_SIZE } from './helpers'

export type TGameControl = 'forward' | 'backward' | 'left' | 'right' | 'jump'

export const arenaHalfSize = GAME_ARENA_HALF_SIZE
export const monkeyAimPrecision = 0.1
export const atmosphereParticleCount = 180
export const projectilePoolSize = 40
export const monkeyHitRadius = 1.45
export const monkeyHitboxOffset = new Vector3(0, 0.95, 0)
export const hardcoreMonkeyFlightHeightMax = 6.1
export const hardcoreMonkeyFlightHeightMin = 2.2
export const hardcoreMonkeyFlightProximity = 0.7
export const hardcoreMonkeyFlightSpeed = 4.2
export const heartPickupRadius = 1.55
export const heartSpawnHeight = 0.9
export const heartSpawnPlacementAttempts = 40
export const playerHitRadius = 1.35
export const playerFacingTurnSpeed = 10
export const playerJumpGravity = 26
export const playerJumpVelocity = 11
export const pointerLookSensitivity = 0.0022
export const pointerMaxPitch = Math.PI / 3.1
export const pointerMinPitch = -Math.PI / 4.2
export const pointerLockSelector = '#game-scene-canvas'
export const playerCameraDistance = 6.5
export const playerCameraHeight = 2
export const playerColliderHalfHeight = 1.08
export const playerHitboxOffset = new Vector3(0, 1.2, 0)
export const playerCollisionRadius = 0.58
export const playerBodyGroundOffset =
  playerColliderHalfHeight + playerCollisionRadius
export const worldUp = new Vector3(0, 1, 0)
export const gameControlMap: KeyboardControlsEntry<TGameControl>[] = [
  { keys: ['ArrowUp', 'KeyW'], name: 'forward' },
  { keys: ['ArrowDown', 'KeyS'], name: 'backward' },
  { keys: ['ArrowLeft', 'KeyA'], name: 'left' },
  { keys: ['ArrowRight', 'KeyD'], name: 'right' },
  { keys: ['Space'], name: 'jump' }
]
export const pointerLockMinPolarAngle = Math.PI / 2 - pointerMaxPitch
export const pointerLockMaxPolarAngle = Math.PI / 2 - pointerMinPitch
export const pointerLockSpeed = pointerLookSensitivity / 0.002
export const playerHitFlashDurationMs = 125
export const playerCameraAimPitch = -0.32
