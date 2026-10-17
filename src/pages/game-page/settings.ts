import type { KeyboardControlsEntry } from '@react-three/drei'
import { Vector3 } from 'three'
import type { ICrateLayout, TWorldPosition } from './world-layout'

export type TGameControl = 'forward' | 'backward' | 'left' | 'right' | 'jump'

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
export const TREE_LAYOUT_COUNT = 12
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
export const CRATE_LAYOUT_COUNT = BOX_LAYOUTS.length
export const CRATE_PLACEMENT_ATTEMPTS = 240
export const CRATE_FOOTPRINT_PADDING = 0.45
export const CRATE_PLACEMENT_MARGIN = 1.25
export const CRATE_STACK_HEIGHT_MAX = 3
export const PLAYER_START_CRATE_EXCLUSION_RADIUS = 6.5

export const ARENA_HALF_SIZE = GAME_ARENA_HALF_SIZE
export const MONKEY_AIM_PRECISION = 0.1
export const ATMOSPHERE_PARTICLE_COUNT = 180
export const PROJECTILE_POOL_SIZE = 40
export const MONKEY_HIT_RADIUS = 1.45
export const MONKEY_HITBOX_OFFSET = new Vector3(0, 0.95, 0)
export const HARDCORE_MONKEY_FLIGHT_HEIGHT_MAX = 6.1
export const HARDCORE_MONKEY_FLIGHT_HEIGHT_MIN = 2.2
export const HARDCORE_MONKEY_FLIGHT_PROXIMITY = 0.7
export const HARDCORE_MONKEY_FLIGHT_SPEED = 4.2
export const HEART_PICKUP_RADIUS = 1.55
export const HEART_SPAWN_HEIGHT = 0.9
export const HEART_SPAWN_PLACEMENT_ATTEMPTS = 40
export const PLAYER_HIT_RADIUS = 1.35
export const PLAYER_FACING_TURN_SPEED = 10
export const PLAYER_JUMP_GRAVITY = 26
export const PLAYER_JUMP_VELOCITY = 11
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
