import { create } from 'zustand'
import type { TDifficultyLevel } from 'pages/game-page/helpers'

export interface ITemporaryScoreRun {
  difficulty: TDifficultyLevel
  enemiesDefeated: number
  playerName: string
}

interface IGameTemporaryScoreStore {
  clearAllTemporary: () => void
  clearPendingRun: () => void
  incrementEnemiesDefeated: () => void
  pendingRun: ITemporaryScoreRun | null
  setEnemiesDefeatedCount: (enemiesDefeated: number) => void
  setPendingRun: (payload: {
    difficulty: TDifficultyLevel
    playerName: string
  }) => void
}

function normalizePlayerName(playerName: string) {
  return playerName.trim()
}

export const useGameTemporaryScoreStore = create<IGameTemporaryScoreStore>()(
  (set) => ({
    pendingRun: null,
    setPendingRun: ({ difficulty, playerName }) => {
      const normalizedPlayerName = normalizePlayerName(playerName)

      if (normalizedPlayerName.length === 0) {
        return
      }

      set({
        pendingRun: {
          difficulty,
          enemiesDefeated: 0,
          playerName: normalizedPlayerName
        }
      })
    },
    setEnemiesDefeatedCount: (enemiesDefeated) => {
      set((currentState) => {
        if (!currentState.pendingRun) {
          return currentState
        }

        return {
          pendingRun: {
            ...currentState.pendingRun,
            enemiesDefeated: Math.max(0, enemiesDefeated)
          }
        }
      })
    },
    incrementEnemiesDefeated: () => {
      set((currentState) => {
        if (!currentState.pendingRun) {
          return currentState
        }

        return {
          pendingRun: {
            ...currentState.pendingRun,
            enemiesDefeated: currentState.pendingRun.enemiesDefeated + 1
          }
        }
      })
    },
    clearPendingRun: () => {
      set({ pendingRun: null })
    },
    clearAllTemporary: () => {
      set({ pendingRun: null })
    }
  })
)
