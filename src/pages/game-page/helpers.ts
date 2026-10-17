export type TDifficultyLevel = 'Easy' | 'Pro' | 'Hardcore'

export type TGameStatus = 'menu' | 'countdown' | 'playing' | 'won' | 'lost'

export type { ICrateLayout, ITreeLayout, TWorldPosition } from './world-layout'

export {
  ARENA_BOUNDARY_COLLIDER_HEIGHT,
  ARENA_BOUNDARY_COLLIDER_THICKNESS,
  CRATE_FOOTPRINT_PADDING,
  CRATE_LAYOUT_COUNT,
  CRATE_PLACEMENT_ATTEMPTS,
  CRATE_PLACEMENT_MARGIN,
  CRATE_SIZE_PRESETS,
  CRATE_STACK_HEIGHT_MAX,
  GAME_ARENA_HALF_SIZE,
  GAME_FOG_FAR,
  GAME_FOG_NEAR,
  GAME_GROUND_SIZE,
  PLAYER_START_POSITION,
  PLAYER_START_CRATE_EXCLUSION_RADIUS,
  TREE_LAYOUT_COUNT,
  TREE_TRUNK_COLLIDER_ARGS
} from './settings'

export { createRandomBoxLayouts, createRandomTreeLayouts } from './world-layout'

export interface IDifficultyConfig {
  axeSpeed: number
  label: TDifficultyLevel
  monkeyThrowInterval: number
}

export interface IGameSceneProps {
  difficulty: TDifficultyLevel
  isActive: boolean
  onHealthChange: (health: number) => void
  onMonkeyHit: () => void
  roundKey: number
}

export const DESKTOP_BREAKPOINT = 1024
export const MAX_HEALTH = 100
export const MONKEY_DAMAGE = 15
export const HEART_HEAL = 20
export const START_RUN_COUNTDOWN_SECONDS = 2
export const SURVIVAL_TIME_SECONDS = 60
export const PROJECTILE_LIFETIME_SECONDS = 3.2
export const HEART_RESPAWN_SECONDS = 10
export const MONKEY_RESPAWN_SECONDS = 5

export const DIFFICULTY_CONFIGS: Record<TDifficultyLevel, IDifficultyConfig> = {
  Easy: {
    label: 'Easy',
    axeSpeed: 8,
    monkeyThrowInterval: 2.6
  },
  Pro: {
    label: 'Pro',
    axeSpeed: 13,
    monkeyThrowInterval: 1.95
  },
  Hardcore: {
    label: 'Hardcore',
    axeSpeed: 18,
    monkeyThrowInterval: 1.3
  }
}

export function clampHealth(health: number) {
  return Math.max(0, Math.min(MAX_HEALTH, health))
}

export function formatTimeLabel(totalSeconds: number) {
  const clampedSeconds = Math.max(0, totalSeconds)
  const minutes = Math.floor(clampedSeconds / 60)
  const seconds = clampedSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getGameStatusLabel(
  gameStatus: TGameStatus,
  countdownSeconds: number
) {
  switch (gameStatus) {
    case 'playing':
      return 'Survive the axe storm'
    case 'countdown':
      return `Run starts in ${countdownSeconds}`
    case 'won':
      return 'You survived the minute'
    case 'lost':
      return 'The raiding party got you'
    default:
      return 'Choose a difficulty'
  }
}
