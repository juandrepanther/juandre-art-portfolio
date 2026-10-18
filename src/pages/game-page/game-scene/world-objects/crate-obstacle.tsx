import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { ICrateLayout } from '../../helpers'

interface ICrateObstacle {
  crateLayout: ICrateLayout
  index: number
}

export function CrateObstacle({ crateLayout, index }: ICrateObstacle) {
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
