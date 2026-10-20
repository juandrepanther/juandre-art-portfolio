import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useGameScoreboardStore } from 'lib/zustand/game-scoreboard-store'

describe('game-scoreboard-store', () => {
  beforeEach(() => {
    localStorage.clear()
    useGameScoreboardStore.getState().resetScoreboard()
  })

  afterEach(() => {
    localStorage.clear()
    useGameScoreboardStore.getState().resetScoreboard()
  })

  it('starts with an empty scoreboard', () => {
    expect(useGameScoreboardStore.getState().scoreboardEntries).toEqual([])
    expect(useGameScoreboardStore.getState().playerNameOptions).toEqual([])
  })

  it('sorts rows by enemies defeated descending', () => {
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 4,
      playerName: 'Lena'
    })
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Hardcore',
      enemiesDefeated: 7,
      playerName: 'Max'
    })

    expect(
      useGameScoreboardStore
        .getState()
        .scoreboardEntries.map((entry) => [
          entry.playerName,
          entry.enemiesDefeated
        ])
    ).toEqual([
      ['Max', 7],
      ['Lena', 4]
    ])
  })

  it('updates only when same player and difficulty has a higher score', () => {
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 5,
      playerName: 'Player1'
    })
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 3,
      playerName: 'Player1'
    })

    let noobEntry = useGameScoreboardStore
      .getState()
      .scoreboardEntries.find(
        (entry) => entry.playerName === 'Player1' && entry.difficulty === 'Noob'
      )

    expect(noobEntry?.enemiesDefeated).toBe(5)

    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 8,
      playerName: 'Player1'
    })

    noobEntry = useGameScoreboardStore
      .getState()
      .scoreboardEntries.find(
        (entry) => entry.playerName === 'Player1' && entry.difficulty === 'Noob'
      )

    expect(noobEntry?.enemiesDefeated).toBe(8)
  })

  it('creates a new row when same player wins with different difficulty', () => {
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Noob',
      enemiesDefeated: 5,
      playerName: 'Player1'
    })
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Hardcore',
      enemiesDefeated: 2,
      playerName: 'Player1'
    })

    const playerRows = useGameScoreboardStore
      .getState()
      .scoreboardEntries.filter((entry) => entry.playerName === 'Player1')

    expect(playerRows).toHaveLength(2)
    expect(
      playerRows
        .map((entry) => entry.difficulty)
        .sort((a, b) => (a ?? '').localeCompare(b ?? ''))
    ).toEqual(['Hardcore', 'Noob'])
  })

  it('resets scoreboard back to empty', () => {
    useGameScoreboardStore.getState().saveWonRun({
      difficulty: 'Balls',
      enemiesDefeated: 9,
      playerName: 'Neo'
    })

    useGameScoreboardStore.getState().resetScoreboard()

    expect(useGameScoreboardStore.getState().scoreboardEntries).toEqual([])
    expect(useGameScoreboardStore.getState().playerNameOptions).toEqual([])
  })
})
