import { CuboidCollider, RigidBody } from '@react-three/rapier'
import {
  ARENA_BOUNDARY_COLLIDER_HEIGHT,
  ARENA_BOUNDARY_COLLIDER_THICKNESS,
  TREE_LAYOUTS,
  TREE_TRUNK_COLLIDER_ARGS,
  type ICrateLayout
} from '../helpers'
import { ARENA_HALF_SIZE } from '../settings'
import { AnimatedSurfaceMaterial } from './lighting'
import { getTreeVariant } from './helpers'
import type { TTreeVariant } from './types'

interface ICrateField {
  crateLayouts: ICrateLayout[]
}

interface ICrateObstacle {
  crateLayout: ICrateLayout
  index: number
}

interface IEvergreenTree {
  variant: TTreeVariant
}

function EvergreenTree({ variant }: IEvergreenTree) {
  switch (variant) {
    case 0:
      return (
        <>
          <mesh castShadow position={[0, 1.75, 0]} receiveShadow>
            <cylinderGeometry args={[0.35, 0.58, 3.5, 8]} />
            <meshStandardMaterial color="#8c6141" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 4.2, 0]} receiveShadow>
            <coneGeometry args={[2.1, 4.2, 12]} />
            <AnimatedSurfaceMaterial
              accentColor="#c8f2d7"
              amplitude={0.08}
              baseColor="#78bb89"
            />
          </mesh>
          <mesh castShadow position={[0.52, 3.45, 0.4]} receiveShadow>
            <sphereGeometry args={[1.08, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#cdebc0"
              amplitude={0.06}
              baseColor="#6ba86f"
            />
          </mesh>
        </>
      )
    case 1:
      return (
        <>
          <mesh
            castShadow
            position={[0, 1.55, 0]}
            rotation={[0.08, 0, -0.08]}
            receiveShadow
          >
            <cylinderGeometry args={[0.26, 0.52, 3.1, 7]} />
            <meshStandardMaterial color="#8a6040" roughness={0.94} />
          </mesh>
          <mesh
            castShadow
            position={[0.18, 3.15, 0]}
            rotation={[0.06, 0.16, 0.04]}
            receiveShadow
          >
            <coneGeometry args={[1.55, 2.3, 10]} />
            <AnimatedSurfaceMaterial
              accentColor="#d0efcb"
              amplitude={0.07}
              baseColor="#77af7d"
            />
          </mesh>
          <mesh
            castShadow
            position={[-0.35, 4.2, -0.1]}
            rotation={[-0.08, 0.4, -0.06]}
            receiveShadow
          >
            <coneGeometry args={[1.18, 1.95, 10]} />
            <AnimatedSurfaceMaterial
              accentColor="#d7efc9"
              amplitude={0.05}
              baseColor="#8ec387"
            />
          </mesh>
          <mesh
            castShadow
            position={[0.52, 2.7, 0.12]}
            rotation={[0.4, 0.1, 0.86]}
          >
            <cylinderGeometry args={[0.07, 0.09, 1.15, 6]} />
            <meshStandardMaterial color="#8c6141" roughness={0.95} />
          </mesh>
        </>
      )
    default:
      return (
        <>
          <mesh castShadow position={[0, 1.9, 0]} receiveShadow>
            <cylinderGeometry args={[0.42, 0.68, 3.8, 9]} />
            <meshStandardMaterial color="#8e6648" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 4.1, 0]} receiveShadow>
            <sphereGeometry args={[1.5, 18, 18]} />
            <AnimatedSurfaceMaterial
              accentColor="#c4ecd0"
              amplitude={0.05}
              baseColor="#74b07d"
            />
          </mesh>
          <mesh castShadow position={[-0.9, 3.72, 0.24]} receiveShadow>
            <sphereGeometry args={[0.92, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#d1eec3"
              amplitude={0.04}
              baseColor="#6ba86f"
            />
          </mesh>
          <mesh castShadow position={[0.88, 3.54, -0.08]} receiveShadow>
            <sphereGeometry args={[1, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#c8f2d7"
              amplitude={0.04}
              baseColor="#78bb89"
            />
          </mesh>
        </>
      )
  }
}

export function TreeCluster() {
  return (
    <group>
      {TREE_LAYOUTS.map(({ treePosition }, index) => (
        <RigidBody
          colliders={false}
          key={`tree-${index}`}
          position={treePosition}
          rotation={[0, (index % 2 === 0 ? 1 : -1) * 0.18 * (index + 1), 0]}
          type="fixed"
        >
          <CuboidCollider
            args={TREE_TRUNK_COLLIDER_ARGS}
            position={[0, 1.95, 0]}
          />
          <EvergreenTree variant={getTreeVariant(index)} />
        </RigidBody>
      ))}
    </group>
  )
}

export function CrateField({ crateLayouts }: ICrateField) {
  return (
    <group>
      {crateLayouts.map((crateLayout, index) => (
        <CrateObstacle
          crateLayout={crateLayout}
          index={index}
          key={`crate-${index}`}
        />
      ))}
    </group>
  )
}

function CrateObstacle({ crateLayout, index }: ICrateObstacle) {
  const [width, height, depth] = crateLayout.size

  return (
    <RigidBody
      colliders={false}
      position={crateLayout.position}
      rotation={[0, crateLayout.rotationY, 0]}
      type="fixed"
    >
      <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={crateLayout.size} />
        <meshStandardMaterial
          color={index % 2 === 0 ? '#8f6845' : '#7b583a'}
          roughness={0.9}
        />
      </mesh>
      <mesh castShadow position={[0, height * 0.1, depth * 0.38]} receiveShadow>
        <boxGeometry args={[width * 0.9, height * 0.22, depth * 0.14]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
      <mesh
        castShadow
        position={[0, height * 0.1, -depth * 0.38]}
        receiveShadow
      >
        <boxGeometry args={[width * 0.9, height * 0.22, depth * 0.14]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
      <mesh
        castShadow
        position={[width * 0.38, height * 0.08, 0]}
        receiveShadow
      >
        <boxGeometry args={[width * 0.14, height * 0.22, depth * 0.88]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
      <mesh
        castShadow
        position={[-width * 0.38, height * 0.08, 0]}
        receiveShadow
      >
        <boxGeometry args={[width * 0.14, height * 0.22, depth * 0.88]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
    </RigidBody>
  )
}

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
