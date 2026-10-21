import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  TREE_LAYOUT_COUNT,
  type ITreeLayout,
  createRandomTreeLayouts
} from 'pages/game-page/helpers'
import {
  createEnemyState,
  doesProjectilePathHitObstacle,
  isPointInsideArenaWall,
  isPointInsideTreeTrunk
} from 'pages/game-page/game-scene/helpers'
import { Vector3 } from 'three'

function createRandomSequence(values: number[]) {
  let index = 0

  return () => {
    const value = values[index]

    index += 1

    return value ?? values[values.length - 1] ?? 0.5
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('game layout helpers', () => {
  it('generates a full tree layout and keeps enemies attached to the tree positions', () => {
    const randomValues = [
      0.1, 0.1, 0.5, 0.5, 0.5, 0.35, 0.1, 0.5, 0.5, 0.5, 0.6, 0.1, 0.5, 0.5,
      0.5, 0.85, 0.1, 0.5, 0.5, 0.5, 0.1, 0.35, 0.5, 0.5, 0.5, 0.35, 0.35, 0.5,
      0.5, 0.5, 0.6, 0.35, 0.5, 0.5, 0.5, 0.85, 0.35, 0.5, 0.5, 0.5, 0.1, 0.7,
      0.5, 0.5, 0.5, 0.35, 0.7, 0.5, 0.5, 0.5, 0.6, 0.7, 0.5, 0.5, 0.5, 0.85,
      0.7, 0.5, 0.5, 0.5
    ]
    const randomSpy = vi
      .spyOn(Math, 'random')
      .mockImplementation(createRandomSequence(randomValues))

    const treeLayouts = createRandomTreeLayouts()
    const enemyStates = createEnemyState(5, [], treeLayouts)

    expect(randomSpy).toHaveBeenCalled()
    expect(treeLayouts).toHaveLength(TREE_LAYOUT_COUNT)
    expect(enemyStates).toHaveLength(5)
    expect(
      new Set(treeLayouts.map((layout) => layout.treePosition.join(','))).size
    ).toBe(TREE_LAYOUT_COUNT)

    for (const enemyState of enemyStates) {
      expect(enemyState.homePosition.toArray()).toEqual(
        enemyState.position.toArray()
      )
      expect(enemyState.active).toBe(true)
    }
  })

  it('detects tree trunk collisions against generated layouts', () => {
    const treeLayouts: ITreeLayout[] = [
      {
        enemyPosition: [1, 2.5, 1],
        treePosition: [0, 0, 0]
      }
    ]

    expect(
      isPointInsideTreeTrunk(new Vector3(0.2, 1.5, 0.2), treeLayouts)
    ).toBe(true)
    expect(isPointInsideTreeTrunk(new Vector3(4, 1.5, 4), treeLayouts)).toBe(
      false
    )
  })

  it('detects collisions with arena boundary and interior walls', () => {
    expect(isPointInsideArenaWall(new Vector3(37.2, 1.4, 0))).toBe(true)
    expect(isPointInsideArenaWall(new Vector3(-30.5, 1.2, -24))).toBe(true)
    expect(isPointInsideArenaWall(new Vector3(0, 1.2, 0))).toBe(false)
  })

  it('detects swept projectile collisions through walls and trees', () => {
    const treeLayouts: ITreeLayout[] = [
      {
        enemyPosition: [0, 2.5, 0],
        treePosition: [0, 0, 0]
      }
    ]

    expect(
      doesProjectilePathHitObstacle({
        nextPosition: new Vector3(-30.5, 1.2, -15),
        previousPosition: new Vector3(-30.5, 1.2, -33),
        treeLayouts: []
      })
    ).toBe(true)
    expect(
      doesProjectilePathHitObstacle({
        nextPosition: new Vector3(0, 1.2, 2.2),
        previousPosition: new Vector3(0, 1.2, -2.2),
        treeLayouts
      })
    ).toBe(true)
    expect(
      doesProjectilePathHitObstacle({
        nextPosition: new Vector3(4, 1.2, 6),
        previousPosition: new Vector3(4, 1.2, 2),
        treeLayouts: []
      })
    ).toBe(false)
  })
})
