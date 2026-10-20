import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { TDifficultyLevel } from 'pages/game-page/helpers'

export interface IScoreboardEntry {
  difficulty: TDifficultyLevel | null
  enemiesDefeated: number
  playerName: string
}

export interface IWonRunPayload {
  difficulty: TDifficultyLevel
  enemiesDefeated: number
  playerName: string
}

interface IGameScoreboardStore {
  playerNameOptions: string[]
  resetScoreboard: () => void
  saveWonRun: (payload: IWonRunPayload) => void
  scoreboardEntries: IScoreboardEntry[]
}

function normalizePlayerName(playerName: string) {
  return playerName.trim()
}

function compareScoreboardEntries(
  firstEntry: IScoreboardEntry,
  secondEntry: IScoreboardEntry
) {
  if (secondEntry.enemiesDefeated !== firstEntry.enemiesDefeated) {
    return secondEntry.enemiesDefeated - firstEntry.enemiesDefeated
  }

  const playerNameComparison = firstEntry.playerName.localeCompare(
    secondEntry.playerName
  )

  if (playerNameComparison !== 0) {
    return playerNameComparison
  }

  return (firstEntry.difficulty ?? '').localeCompare(
    secondEntry.difficulty ?? ''
  )
}

function buildPlayerNameOptions(scoreboardEntries: IScoreboardEntry[]) {
  const playerNames = new Set<string>()

  scoreboardEntries.forEach((scoreboardEntry) => {
    const normalizedName = normalizePlayerName(scoreboardEntry.playerName)

    if (normalizedName.length > 0) {
      playerNames.add(normalizedName)
    }
  })

  return [...playerNames].sort((firstName, secondName) =>
    firstName.localeCompare(secondName)
  )
}

function createDefaultScoreboardState() {
  return {
    scoreboardEntries: [],
    playerNameOptions: []
  }
}

export const useGameScoreboardStore = create<IGameScoreboardStore>()(
  persist(
    (set) => ({
      ...createDefaultScoreboardState(),
      saveWonRun: ({ difficulty, enemiesDefeated, playerName }) => {
        const normalizedPlayerName = normalizePlayerName(playerName)

        if (normalizedPlayerName.length === 0) {
          return
        }

        set((currentState) => {
          const matchedEntryIndex = currentState.scoreboardEntries.findIndex(
            (scoreboardEntry) =>
              scoreboardEntry.playerName === normalizedPlayerName &&
              scoreboardEntry.difficulty === difficulty
          )

          let nextEntries = [...currentState.scoreboardEntries]

          if (matchedEntryIndex >= 0) {
            const matchedEntry = nextEntries[matchedEntryIndex]

            if (enemiesDefeated > matchedEntry.enemiesDefeated) {
              nextEntries[matchedEntryIndex] = {
                ...matchedEntry,
                enemiesDefeated
              }
            }
          } else {
            nextEntries.push({
              playerName: normalizedPlayerName,
              difficulty,
              enemiesDefeated
            })
          }

          nextEntries = [...nextEntries].sort(compareScoreboardEntries)

          return {
            scoreboardEntries: nextEntries,
            playerNameOptions: buildPlayerNameOptions(nextEntries)
          }
        })
      },
      resetScoreboard: () => {
        set(createDefaultScoreboardState())
      }
    }),
    {
      name: 'juandre-game-scoreboard',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
