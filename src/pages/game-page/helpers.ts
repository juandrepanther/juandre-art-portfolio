import { MAX_HEALTH } from './settings'
import type { TDifficultyLevel } from './settings'

export type TGameStatus = 'menu' | 'countdown' | 'playing' | 'won' | 'lost'

export type { IDifficultyConfig, TDifficultyLevel } from './settings'
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
  DESKTOP_BREAKPOINT,
  DIFFICULTY_CONFIGS,
  ENEMY_DAMAGE,
  ENEMY_RESPAWN_SECONDS,
  GAME_ARENA_HALF_SIZE,
  GAME_FOG_FAR,
  GAME_FOG_NEAR,
  GAME_GROUND_SIZE,
  MAX_HEALTH,
  PAINKILLER_HEAL,
  PAINKILLER_RESPAWN_SECONDS,
  PLAYER_START_CRATE_EXCLUSION_RADIUS,
  PLAYER_START_POSITION,
  PROJECTILE_LIFETIME_SECONDS,
  START_RUN_COUNTDOWN_SECONDS,
  SURVIVAL_TIME_SECONDS,
  TREE_LAYOUT_COUNT,
  TREE_TRUNK_COLLIDER_ARGS
} from './settings'

export { createRandomBoxLayouts, createRandomTreeLayouts } from './world-layout'

export interface IGameSceneProps {
  difficulty: TDifficultyLevel
  isActive: boolean
  onHealthChange: (health: number) => void
  onEnemyHit: () => void
  roundKey: number
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
