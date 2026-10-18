import type { KeyboardControlsEntry } from '@react-three/drei'
import { Vector3 } from 'three'
import type { ICrateLayout, TWorldPosition } from './world-layout'

export type TDifficultyLevel = 'Noob' | 'Balls' | 'Hardcore'
export type TGameControl = 'forward' | 'backward' | 'left' | 'right' | 'jump'

export interface IDifficultyConfig {
  enemyCount: number
  enemyDamage: number
  enemyMovementSpeed: number
  enemyProjectileSpeed: number
  enemyThrowInterval: number
  label: TDifficultyLevel
  roundTime: number
}

export const GAME_ARENA_HALF_SIZE = 38
export const GAME_GROUND_SIZE = 104
export const GAME_BACKGROUND_COLOR = '#7f8b92'
export const GAME_FOG_COLOR = '#98a2a8'
export const DESKTOP_BREAKPOINT = 1024
export const MAX_HEALTH = 100
export const PAINKILLER_HEAL = 20
export const START_RUN_COUNTDOWN_SECONDS = 2
export const PROJECTILE_LIFETIME_SECONDS = 3.2
export const PAINKILLER_RESPAWN_SECONDS = 10
export const ENEMY_RESPAWN_SECONDS = 5
export const DIFFICULTY_CONFIGS: Record<TDifficultyLevel, IDifficultyConfig> = {
  Noob: {
    label: 'Noob',
    enemyCount: 10,
    enemyDamage: 15,
    enemyMovementSpeed: 2.2,
    enemyProjectileSpeed: 8,
    enemyThrowInterval: 2.6,
    roundTime: 15
  },
  Balls: {
    label: 'Balls',
    enemyCount: 15,
    enemyDamage: 20,
    enemyMovementSpeed: 4.2,
    enemyProjectileSpeed: 13,
    enemyThrowInterval: 1.95,
    roundTime: 30
  },
  Hardcore: {
    label: 'Hardcore',
    enemyCount: 18,
    enemyDamage: 25,
    enemyMovementSpeed: 7.4,
    enemyProjectileSpeed: 18,
    enemyThrowInterval: 1.3,
    roundTime: 60
  }
}
export const ARENA_BOUNDARY_COLLIDER_HEIGHT = 8
export const ARENA_BOUNDARY_COLLIDER_THICKNESS = 2
export const TREE_TRUNK_COLLIDER_ARGS: [number, number, number] = [
  0.85, 1.95, 0.85
]
export const PLAYER_START_POSITION: TWorldPosition = [0, 1.1, 23]
export const TREE_LAYOUT_COUNT = 12
export const CRATE_SIZE_PRESETS: ICrateLayout['size'][] = [
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
export const CRATE_LAYOUT_COUNT = 32
export const CRATE_PLACEMENT_ATTEMPTS = 240
export const CRATE_FOOTPRINT_PADDING = 0.45
export const CRATE_PLACEMENT_MARGIN = 1.25
export const CRATE_STACK_HEIGHT_MAX = 3
export const PLAYER_START_CRATE_EXCLUSION_RADIUS = 6.5

export const ARENA_HALF_SIZE = GAME_ARENA_HALF_SIZE
export const ENEMY_AIM_PRECISION = 0.1
export const ATMOSPHERE_PARTICLE_COUNT = 180
export const LIGHTNING_INITIAL_DELAY_SECONDS = 0.9
export const LIGHTNING_MIN_COOLDOWN_SECONDS = 2.8
export const LIGHTNING_MAX_COOLDOWN_SECONDS = 6.2
export const LIGHTNING_MIN_DURATION_SECONDS = 0.22
export const LIGHTNING_MAX_DURATION_SECONDS = 0.4
export const LIGHTNING_AFTERGLOW_SECONDS = 0.3
export const LIGHTNING_MIN_INTENSITY = 1.05
export const LIGHTNING_MAX_INTENSITY = 1.65
export const LIGHTNING_MIN_PULSE_FREQUENCY = 18
export const LIGHTNING_MAX_PULSE_FREQUENCY = 34
export const LIGHTNING_MIN_SPREAD = 2.1
export const LIGHTNING_MAX_SPREAD = 5.4
export const LIGHTNING_FLASH_POINT_HEIGHT = 20
export const LIGHTNING_FLASH_POINT_DISTANCE = 40
export const LIGHTNING_FLASH_POINT_INTENSITY = 28
export const LIGHTNING_DIRECTIONAL_LIGHT_BOOST = 3.2
export const LIGHTNING_SPOTLIGHT_BOOST = 34
export const LIGHTNING_COLOR = '#eef8ff'
export const LIGHTNING_GLOW_COLOR = '#b8dcff'
export const DIRECTIONAL_LIGHT_BASE_COLOR = '#cad4de'
export const DIRECTIONAL_LIGHT_BASE_INTENSITY = 1.1
export const DIRECTIONAL_LIGHT_POSITION: [number, number, number] = [9, 16, 8]
export const DIRECTIONAL_LIGHT_SHADOW_CAMERA_BOUNDS = 30
export const DIRECTIONAL_LIGHT_SHADOW_CAMERA_FAR = 38
export const DIRECTIONAL_LIGHT_SHADOW_MAP_SIZE = 2048
export const DIRECTIONAL_LIGHT_SHADOW_BIAS = -0.00018
export const DIRECTIONAL_LIGHT_SHADOW_NORMAL_BIAS = 0.03
export const PROJECTILE_POOL_SIZE = 40
export const ENEMY_HIT_RADIUS = 1.45
export const ENEMY_HITBOX_OFFSET = new Vector3(0, 0.95, 0)
export const HARDCORE_ENEMY_FLIGHT_HEIGHT_MAX = 2.5
export const HARDCORE_ENEMY_FLIGHT_HEIGHT_MIN = 0
export const HARDCORE_ENEMY_FLIGHT_PROXIMITY = 0.7
export const HARDCORE_ENEMY_FLIGHT_SPEED = 4.2
export const PAINKILLER_PICKUP_RADIUS = 1.55
export const PAINKILLER_SPAWN_HEIGHT = 0.9
export const PAINKILLER_SPAWN_PLACEMENT_ATTEMPTS = 40
export const PLAYER_AXE_SPEED = 22
export const PLAYER_HIT_RADIUS = 1.35
export const PLAYER_FACING_TURN_SPEED = 10
export const PLAYER_JUMP_GRAVITY = 26
export const PLAYER_JUMP_VELOCITY = 11
export const PLAYER_MOVE_SPEED = 12
export const POINTER_LOOK_SENSITIVITY = 0.0022
export const POINTER_MAX_PITCH = Math.PI / 3.1
export const POINTER_MIN_PITCH = -Math.PI / 4.2
export const POINTER_LOCK_SELECTOR = '#game-scene-canvas'
export const PLAYER_CAMERA_DISTANCE = 6.5
export const PLAYER_CAMERA_HEIGHT = 2
export const PLAYER_COLLIDER_HALF_HEIGHT = 1.08
export const PLAYER_HITBOX_OFFSET = new Vector3(0, 1.2, 0)
export const PLAYER_COLLISION_RADIUS = 0.58
export const PLAYER_BODY_GROUND_OFFSET =
  PLAYER_COLLIDER_HALF_HEIGHT + PLAYER_COLLISION_RADIUS
export const WORLD_UP = new Vector3(0, 1, 0)
export const GAME_CONTROL_MAP: KeyboardControlsEntry<TGameControl>[] = [
  { keys: ['ArrowUp', 'KeyW'], name: 'forward' },
  { keys: ['ArrowDown', 'KeyS'], name: 'backward' },
  { keys: ['ArrowLeft', 'KeyA'], name: 'left' },
  { keys: ['ArrowRight', 'KeyD'], name: 'right' },
  { keys: ['Space'], name: 'jump' }
]
export const POINTER_LOCK_MIN_POLAR_ANGLE = Math.PI / 2 - POINTER_MAX_PITCH
export const POINTER_LOCK_MAX_POLAR_ANGLE = Math.PI / 2 - POINTER_MIN_PITCH
export const POINTER_LOCK_SPEED = POINTER_LOOK_SENSITIVITY / 0.002
export const PLAYER_HIT_FLASH_DURATION_MS = 125
export const PLAYER_CAMERA_AIM_PITCH = -0.32
