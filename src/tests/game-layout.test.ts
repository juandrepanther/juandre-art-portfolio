import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  TREE_LAYOUT_COUNT,
  type ITreeLayout,
  createRandomTreeLayouts
} from 'pages/game-page/helpers'
import {
  createEnemyState,
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
    const enemyStates = createEnemyState(treeLayouts)

    expect(randomSpy).toHaveBeenCalled()
    expect(treeLayouts).toHaveLength(TREE_LAYOUT_COUNT)
    expect(enemyStates).toHaveLength(TREE_LAYOUT_COUNT)
    expect(
      new Set(treeLayouts.map((layout) => layout.treePosition.join(','))).size
    ).toBe(TREE_LAYOUT_COUNT)

    for (const [index, layout] of treeLayouts.entries()) {
      expect(layout.enemyPosition).not.toEqual(layout.treePosition)
      expect(enemyStates[index]?.homePosition.toArray()).toEqual(
        layout.enemyPosition
      )
      expect(enemyStates[index]?.position.toArray()).toEqual(
        layout.enemyPosition
      )
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
})
