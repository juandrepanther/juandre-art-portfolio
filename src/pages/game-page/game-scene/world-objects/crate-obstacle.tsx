import {
  CuboidCollider,
  RapierCollider,
  RapierRigidBody,
  RigidBody
} from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useRef, type RefObject } from 'react'
import type { ICrateLayout } from '../../helpers'
import type { TDifficultyLevel } from '../../settings'
import { RoundedBox, Sparkles } from '@react-three/drei'
import type { Mesh } from 'three'
import {
  createRuntimeCrateLayout,
  shouldAnimateCrateHeight
} from '../../crate-height-animation'

interface ICrateObstacle {
  animatedCrateFlagsRef: RefObject<boolean[]>
  animationOffset?: number
  crateLayout: ICrateLayout
  difficulty: TDifficultyLevel
  index: number
  shouldRenderVisualEffects: boolean
}

export function CrateObstacle({
  animatedCrateFlagsRef,
  animationOffset,
  crateLayout,
  difficulty,
  index,
  shouldRenderVisualEffects
}: ICrateObstacle) {
  const [width, height, depth] = crateLayout.size
  const crateMeshRef = useRef<Mesh | null>(null)
  const rigidBodyRef = useRef<RapierRigidBody | null>(null)
  const colliderRef = useRef<RapierCollider | null>(null)

  useFrame(({ clock }) => {
    const isCrateHeightAnimated =
      shouldAnimateCrateHeight(difficulty) &&
      (animatedCrateFlagsRef.current[index] ?? false)
    const runtimeCrateLayout = createRuntimeCrateLayout(
      crateLayout,
      clock.elapsedTime,
      isCrateHeightAnimated,
      animationOffset
    )
    const nextHeight = runtimeCrateLayout.size[1]

    rigidBodyRef.current?.setTranslation(
      {
        x: runtimeCrateLayout.position[0],
        y: runtimeCrateLayout.position[1],
        z: runtimeCrateLayout.position[2]
      },
      false
    )
    colliderRef.current?.setHalfExtents({
      x: width / 2,
      y: nextHeight / 2,
      z: depth / 2
    })

    if (crateMeshRef.current) {
      crateMeshRef.current.scale.y = nextHeight / height
    }
  })

  return (
    <RigidBody
      colliders={false}
      position={crateLayout.position}
      ref={rigidBodyRef}
      rotation={[0, crateLayout.rotationY, 0]}
      type="fixed"
      friction={0}
    >
      <CuboidCollider
        args={[width / 2, height / 2, depth / 2]}
        ref={colliderRef}
      />
      <RoundedBox
        args={crateLayout.size}
        castShadow
        ref={crateMeshRef}
        receiveShadow
        radius={0.48}
      >
        <meshStandardMaterial
          color={index % 2 === 0 ? '#8f6845' : '#7b583a'}
          roughness={0.9}
        />
      </RoundedBox>
      {shouldRenderVisualEffects ? (
        <Sparkles count={50} scale={5} size={8} speed={2.4} />
      ) : null}
    </RigidBody>
  )
}
