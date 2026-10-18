import { CuboidCollider } from '@react-three/rapier'
import {
  ARENA_BOUNDARY_COLLIDER_HEIGHT,
  ARENA_BOUNDARY_COLLIDER_THICKNESS
} from '../../helpers'
import { ARENA_HALF_SIZE } from 'pages/game-page/settings'

export function ArenaBounds() {
  const halfThickness = ARENA_BOUNDARY_COLLIDER_THICKNESS / 2
  const sideLength = ARENA_HALF_SIZE + ARENA_BOUNDARY_COLLIDER_THICKNESS
  const halfHeight = ARENA_BOUNDARY_COLLIDER_HEIGHT / 2

  return (
    <group>
      <CuboidCollider
        args={[halfThickness, halfHeight, sideLength]}
        position={[ARENA_HALF_SIZE + halfThickness, halfHeight, 0]}
      />
      <CuboidCollider
        args={[halfThickness, halfHeight, sideLength]}
        position={[-ARENA_HALF_SIZE - halfThickness, halfHeight, 0]}
      />
      <CuboidCollider
        args={[sideLength, halfHeight, halfThickness]}
        position={[0, halfHeight, ARENA_HALF_SIZE + halfThickness]}
      />
      <CuboidCollider
        args={[sideLength, halfHeight, halfThickness]}
        position={[0, halfHeight, -ARENA_HALF_SIZE - halfThickness]}
      />
    </group>
  )
}
