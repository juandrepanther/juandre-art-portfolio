import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { ICrateLayout } from '../../helpers'
import { RoundedBox, Sparkles } from '@react-three/drei'

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
      <RoundedBox
        args={crateLayout.size}
        castShadow
        receiveShadow
        radius={0.48}
      >
        <meshStandardMaterial
          color={index % 2 === 0 ? '#8f6845' : '#7b583a'}
          roughness={0.9}
        />
      </RoundedBox>
      <Sparkles count={50} scale={5} size={8} speed={2.4} />
    </RigidBody>
  )
}
