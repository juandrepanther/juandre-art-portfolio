export type TDifficultyLevel = 'Easy' | 'Pro' | 'Survivor'

export type TGameStatus = 'menu' | 'countdown' | 'playing' | 'won' | 'lost'

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

export interface ITreeLayout {
  monkeyPosition: [number, number, number]
  treePosition: [number, number, number]
}

export const DESKTOP_BREAKPOINT = 1024
export const MAX_HEALTH = 100
export const MONKEY_DAMAGE = 5
export const HEART_HEAL = 20
export const START_RUN_COUNTDOWN_SECONDS = 2
export const SURVIVAL_TIME_SECONDS = 60
export const PLAYER_AXE_SPEED = 22
export const PLAYER_MOVE_SPEED = 8
export const PROJECTILE_LIFETIME_SECONDS = 3.2
export const HEART_RESPAWN_SECONDS = 10
export const MONKEY_RESPAWN_SECONDS = 5
export const PLAYER_START_POSITION: [number, number, number] = [0, 1.1, 8]
export const TREE_LAYOUTS: ITreeLayout[] = [
  {
    treePosition: [-10, 0, -10],
    monkeyPosition: [-10.5, 2.5, -11]
  },
  {
    treePosition: [10, 0, -9],
    monkeyPosition: [9.4, 2.3, -10.2]
  },
  {
    treePosition: [-12, 0, 7],
    monkeyPosition: [-12.8, 2.6, 6.4]
  },
  {
    treePosition: [11.5, 0, 8.5],
    monkeyPosition: [10.6, 2.3, 7.8]
  },
  {
    treePosition: [0, 0, -14],
    monkeyPosition: [0.2, 2.5, -15]
  }
]

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
  Survivor: {
    label: 'Survivor',
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
