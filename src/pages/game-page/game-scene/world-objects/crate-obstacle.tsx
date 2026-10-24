import {
  CuboidCollider,
  RapierCollider,
  RapierRigidBody,
  RigidBody
} from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, type RefObject } from 'react'
import type { ICrateLayout } from '../../helpers'
import type { TDifficultyLevel } from '../../settings'
import { Sparkles, useTexture } from '@react-three/drei'
import boxTextureUrl from 'assets/images/walls/box.png?url'
import { SRGBColorSpace, type Mesh } from 'three'
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
  const boxTexture = useTexture(boxTextureUrl)

  useEffect(() => {
    boxTexture.colorSpace = SRGBColorSpace
    boxTexture.needsUpdate = true
  }, [boxTexture])

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
      <mesh castShadow ref={crateMeshRef} receiveShadow>
        <boxGeometry args={crateLayout.size} />
        <meshStandardMaterial map={boxTexture} roughness={0.9} />
      </mesh>
      {shouldRenderVisualEffects ? (
        <Sparkles count={50} scale={5} size={8} speed={2.4} />
      ) : null}
    </RigidBody>
  )
}
