import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createExplosionParticleState,
  createTntState,
  spawnExplosionParticles
} from 'pages/game-page/game-scene/helpers'
import { doesCircleIntersectAnyCrate } from 'pages/game-page/world-collision'
import {
  TNT_BOX_COUNT,
  TNT_BOX_SIZE,
  TREE_TRUNK_COLLIDER_ARGS
} from 'pages/game-page/settings'
import type { ICrateLayout, ITreeLayout } from 'pages/game-page/world-layout'
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

describe('tnt state helpers', () => {
  it('creates active TNT boxes on the ground without overlapping hazards', () => {
    vi.spyOn(Math, 'random').mockImplementation(
      createRandomSequence([
        0.06, 0.08, 0.13, 0.08, 0.2, 0.08, 0.27, 0.08, 0.34, 0.08, 0.41, 0.08,
        0.48, 0.08, 0.55, 0.08, 0.62, 0.08, 0.69, 0.08, 0.76, 0.08, 0.83, 0.08,
        0.9, 0.08, 0.97, 0.08
      ])
    )

    const crateLayouts: ICrateLayout[] = [
      {
        position: [0, 0.9, 0],
        rotationY: 0,
        size: [2.4, 1.8, 2.4]
      }
    ]
    const treeLayouts: ITreeLayout[] = [
      {
        enemyPosition: [10, 2.3, 10],
        treePosition: [10, 0, 10]
      }
    ]
    const tntStates = createTntState(crateLayouts, treeLayouts)
    const footprintRadius =
      Math.hypot(TNT_BOX_SIZE[0], TNT_BOX_SIZE[2]) / 2 + 0.25

    expect(tntStates).toHaveLength(TNT_BOX_COUNT)

    for (const tntState of tntStates) {
      expect(tntState.active).toBe(true)
      expect(tntState.position.y).toBe(TNT_BOX_SIZE[1] / 2)
      expect(
        doesCircleIntersectAnyCrate(
          { x: tntState.position.x, z: tntState.position.z },
          footprintRadius,
          crateLayouts,
          0.1
        )
      ).toBe(false)

      const deltaX = tntState.position.x - treeLayouts[0].treePosition[0]
      const deltaZ = tntState.position.z - treeLayouts[0].treePosition[2]

      expect(
        deltaX * deltaX + deltaZ * deltaZ >
          (Math.max(TREE_TRUNK_COLLIDER_ARGS[0], TREE_TRUNK_COLLIDER_ARGS[2]) +
            footprintRadius +
            0.45) **
            2
      ).toBe(true)
    }

    for (let index = 0; index < tntStates.length; index += 1) {
      const current = tntStates[index]

      for (
        let otherIndex = index + 1;
        otherIndex < tntStates.length;
        otherIndex += 1
      ) {
        const other = tntStates[otherIndex]

        expect(current.position.distanceTo(other.position)).toBeGreaterThan(
          footprintRadius * 2 + 0.25
        )
      }
    }
  })

  it('spawns explosion particles from the first inactive slots', () => {
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5)

    const particleStates = Array.from({ length: 4 }, () =>
      createExplosionParticleState()
    )
    const origin = new Vector3(4, 2, -3)

    spawnExplosionParticles(particleStates, origin, 2)

    expect(particleStates[0].active).toBe(true)
    expect(particleStates[1].active).toBe(true)
    expect(particleStates[2].active).toBe(false)
    expect(particleStates[0].position.toArray()).toEqual(origin.toArray())
    expect(particleStates[1].ttl).toBeGreaterThan(0)
  })
})
