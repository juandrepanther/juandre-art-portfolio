import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useGameTemporaryScoreStore } from 'lib/zustand/game-temporary-score-store'

describe('game-temporary-score-store', () => {
  beforeEach(() => {
    useGameTemporaryScoreStore.getState().clearAllTemporary()
  })

  afterEach(() => {
    useGameTemporaryScoreStore.getState().clearAllTemporary()
  })

  it('creates a pending run with zero kills', () => {
    useGameTemporaryScoreStore.getState().setPendingRun({
      difficulty: 'Noob',
      playerName: 'Player1'
    })

    expect(useGameTemporaryScoreStore.getState().pendingRun).toMatchObject({
      difficulty: 'Noob',
      enemiesDefeated: 0,
      playerName: 'Player1'
    })
  })

  it('increments pending run enemy count', () => {
    useGameTemporaryScoreStore.getState().setPendingRun({
      difficulty: 'Noob',
      playerName: 'Player1'
    })

    useGameTemporaryScoreStore.getState().incrementEnemiesDefeated()
    useGameTemporaryScoreStore.getState().incrementEnemiesDefeated()

    expect(
      useGameTemporaryScoreStore.getState().pendingRun?.enemiesDefeated
    ).toBe(2)
  })

  it('clears pending run with both clear actions', () => {
    useGameTemporaryScoreStore.getState().setPendingRun({
      difficulty: 'Balls',
      playerName: 'Player2'
    })

    useGameTemporaryScoreStore.getState().clearPendingRun()

    expect(useGameTemporaryScoreStore.getState().pendingRun).toBeNull()

    useGameTemporaryScoreStore.getState().setPendingRun({
      difficulty: 'Balls',
      playerName: 'Player2'
    })

    useGameTemporaryScoreStore.getState().clearAllTemporary()

    expect(useGameTemporaryScoreStore.getState().pendingRun).toBeNull()
  })

  it('ignores empty player names', () => {
    useGameTemporaryScoreStore.getState().setPendingRun({
      difficulty: 'Hardcore',
      playerName: '   '
    })

    expect(useGameTemporaryScoreStore.getState().pendingRun).toBeNull()
  })
})
