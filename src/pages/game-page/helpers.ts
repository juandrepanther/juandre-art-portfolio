import { MAX_HEALTH } from './settings'
import type {
  ICharacterConfig,
  IDifficultyConfig,
  TDifficultyLevel
} from './settings'

export type TGameStatus = 'menu' | 'countdown' | 'playing' | 'won' | 'lost'

export type {
  ICharacterConfig,
  IDifficultyConfig,
  TCharacterId,
  TDifficultyLevel
} from './settings'
export type { ICrateLayout, ITreeLayout, TWorldPosition } from './world-layout'

export {
  ARENA_BOUNDARY_COLLIDER_HEIGHT,
  ARENA_BOUNDARY_COLLIDER_THICKNESS,
  CHARACTER_CONFIGS,
  CRATE_FOOTPRINT_PADDING,
  CRATE_LAYOUT_COUNT,
  CRATE_PLACEMENT_ATTEMPTS,
  CRATE_PLACEMENT_MARGIN,
  CRATE_SIZE_PRESETS,
  CRATE_STACK_HEIGHT_MAX,
  DESKTOP_BREAKPOINT,
  DIFFICULTY_CONFIGS,
  GAME_BACKGROUND_COLOR,
  ENEMY_RESPAWN_SECONDS,
  GAME_ARENA_HALF_SIZE,
  GAME_FOG_COLOR,
  GAME_GROUND_SIZE,
  MAX_HEALTH,
  PAINKILLER_HEAL,
  PAINKILLER_RESPAWN_SECONDS,
  PLAYER_START_CRATE_EXCLUSION_RADIUS,
  PLAYER_START_POSITION,
  PROJECTILE_LIFETIME_SECONDS,
  START_RUN_COUNTDOWN_SECONDS,
  TREE_LAYOUT_COUNT,
  TREE_TRUNK_COLLIDER_ARGS
} from './settings'

export { createRandomBoxLayouts, createRandomTreeLayouts } from './world-layout'

export interface IGameSceneProps {
  characterConfig: ICharacterConfig
  difficultyConfig: IDifficultyConfig
  difficulty: TDifficultyLevel
  health: number
  isActive: boolean
  isCameraOrbiting: boolean
  onHealthChange: (health: number) => void
  onEnemyHit: () => void
  playerName: string
  roundKey: number
  showHealthMeter: boolean
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
