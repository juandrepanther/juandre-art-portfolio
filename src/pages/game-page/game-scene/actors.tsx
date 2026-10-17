import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { TREE_LAYOUTS } from '../helpers'
import { projectilePoolSize } from '../settings'
import { Group, MeshStandardMaterial as ThreeMeshStandardMaterial } from 'three'
import { AnimatedSurfaceMaterial } from './lighting'
import type {
  IHeartState,
  IMonkeyState,
  IProjectileState,
  TProjectileOwner
} from './types'

interface IHeartPickups {
  heartStateRef: RefObject<IHeartState[]>
}

interface IHeartPickup {
  heartStateRef: RefObject<IHeartState[]>
  index: number
}

interface IVikingTroop {
  monkeyStateRef: RefObject<IMonkeyState[]>
}

interface IVikingEnemy {
  index: number
  monkeyStateRef: RefObject<IMonkeyState[]>
}

interface IAxeProjectiles {
  projectilesRef: RefObject<IProjectileState[]>
}

interface IAxeProjectile {
  index: number
  projectilesRef: RefObject<IProjectileState[]>
}

interface IProjectilePalette {
  blade: string
  bladeEdge: string
  handle: string
}

export function HeartPickups({ heartStateRef }: IHeartPickups) {
  return (
    <group>
      {TREE_LAYOUTS.map((_, index) => (
        <HeartPickup
          heartStateRef={heartStateRef}
          index={index}
          key={`heart-${index}`}
        />
      ))}
    </group>
  )
}

function HeartPickup({ heartStateRef, index }: IHeartPickup) {
  const heartRef = useRef<Group | null>(null)

  useFrame(({ clock }) => {
    const heartState = heartStateRef.current[index]

    if (!heartRef.current || !heartState) {
      return
    }

    heartRef.current.visible = heartState.active
    heartRef.current.position.copy(heartState.position)
    heartRef.current.position.y +=
      Math.sin(clock.elapsedTime * 2 + heartState.animationOffset) * 0.12
    heartRef.current.rotation.y = clock.elapsedTime * 1.4
  })

  return (
    <group ref={heartRef}>
      <mesh castShadow>
        <sphereGeometry args={[0.4, 20, 20]} />
        <AnimatedSurfaceMaterial
          accentColor="#ffe5ea"
          amplitude={0.03}
          baseColor="#ff7b95"
        />
      </mesh>
      <mesh castShadow position={[-0.22, -0.08, 0]} rotation={[0, 0, 0.88]}>
        <capsuleGeometry args={[0.16, 0.26, 4, 8]} />
        <meshStandardMaterial color="#ff9ab0" />
      </mesh>
      <mesh castShadow position={[0.22, -0.08, 0]} rotation={[0, 0, -0.88]}>
        <capsuleGeometry args={[0.16, 0.26, 4, 8]} />
        <meshStandardMaterial color="#ff9ab0" />
      </mesh>
    </group>
  )
}

export function VikingTroop({ monkeyStateRef }: IVikingTroop) {
  return (
    <group>
      {TREE_LAYOUTS.map((_, index) => (
        <VikingEnemy
          index={index}
          key={`monkey-${index}`}
          monkeyStateRef={monkeyStateRef}
        />
      ))}
    </group>
  )
}

function VikingEnemy({ index, monkeyStateRef }: IVikingEnemy) {
  const monkeyRef = useRef<Group | null>(null)

  useFrame(({ clock }) => {
    const monkeyState = monkeyStateRef.current[index]

    if (!monkeyRef.current || !monkeyState) {
      return
    }

    monkeyRef.current.visible = monkeyState.active
    monkeyRef.current.position.copy(monkeyState.position)
    monkeyRef.current.rotation.y = monkeyState.rotationY
    monkeyRef.current.position.y +=
      Math.sin(clock.elapsedTime * 3 + monkeyState.animationOffset) * 0.06
  })

  return (
    <group ref={monkeyRef}>
      <mesh castShadow position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.42, 0.8, 8, 12]} />
        <AnimatedSurfaceMaterial
          accentColor="#d8dbe0"
          amplitude={0.05}
          baseColor="#6d737b"
        />
      </mesh>
      <mesh castShadow position={[0, 1.7, 0.12]}>
        <sphereGeometry args={[0.34, 18, 18]} />
        <AnimatedSurfaceMaterial
          accentColor="#ecd2b0"
          amplitude={0.04}
          baseColor="#d7a06b"
        />
      </mesh>
      <mesh castShadow position={[0, 2.05, 0.08]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.42, 0.48, 0.42, 10]} />
        <meshStandardMaterial
          color="#8b9298"
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>
      <mesh castShadow position={[0.46, 2.1, 0.1]} rotation={[0, 0, -0.65]}>
        <coneGeometry args={[0.12, 0.64, 8]} />
        <meshStandardMaterial
          color="#cfd6dc"
          metalness={0.45}
          roughness={0.38}
        />
      </mesh>
      <mesh castShadow position={[-0.46, 2.1, 0.1]} rotation={[0, 0, 0.65]}>
        <coneGeometry args={[0.12, 0.64, 8]} />
        <meshStandardMaterial
          color="#cfd6dc"
          metalness={0.45}
          roughness={0.38}
        />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0.22]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.24, 0.48, 8]} />
        <meshStandardMaterial color="#6f4a2e" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.35, 1.75, 0.38]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#241b18" />
      </mesh>
      <mesh castShadow position={[-0.35, 1.75, 0.38]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#241b18" />
      </mesh>
    </group>
  )
}

export function AxeProjectiles({ projectilesRef }: IAxeProjectiles) {
  return (
    <group>
      {Array.from({ length: projectilePoolSize }, (_, index) => (
        <AxeProjectile
          index={index}
          key={`axe-${index}`}
          projectilesRef={projectilesRef}
        />
      ))}
    </group>
  )
}

function AxeProjectile({ index, projectilesRef }: IAxeProjectile) {
  const axeRef = useRef<Group | null>(null)
  const handleMaterialRef = useRef<ThreeMeshStandardMaterial | null>(null)
  const bladeMaterialRef = useRef<ThreeMeshStandardMaterial | null>(null)
  const bladeEdgeMaterialRef = useRef<ThreeMeshStandardMaterial | null>(null)

  useFrame(() => {
    const projectileState = projectilesRef.current[index]

    if (
      !axeRef.current ||
      !handleMaterialRef.current ||
      !bladeMaterialRef.current ||
      !bladeEdgeMaterialRef.current ||
      !projectileState
    ) {
      return
    }

    const palette = getProjectilePalette(projectileState.owner)

    axeRef.current.visible = projectileState.active
    axeRef.current.position.copy(projectileState.position)
    handleMaterialRef.current.color.set(palette.handle)
    bladeMaterialRef.current.color.set(palette.blade)
    bladeEdgeMaterialRef.current.color.set(palette.bladeEdge)

    if (projectileState.velocity.lengthSq() > 0) {
      axeRef.current.rotation.z += 0.18
    }
  })

  return (
    <group ref={axeRef}>
      <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.045, 0.055, 0.92, 8]} />
        <meshStandardMaterial
          ref={handleMaterialRef}
          color="#7b5534"
          roughness={0.86}
        />
      </mesh>
      <mesh castShadow position={[0.2, 0.18, 0]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.34, 0.14, 0.08]} />
        <meshStandardMaterial
          ref={bladeMaterialRef}
          color="#d9e4ea"
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>
      <mesh castShadow position={[0.34, 0.28, 0]} rotation={[0, 0, 0.72]}>
        <coneGeometry args={[0.1, 0.34, 8]} />
        <meshStandardMaterial
          ref={bladeEdgeMaterialRef}
          color="#d9e4ea"
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>
      <mesh castShadow position={[-0.12, -0.18, 0]} rotation={[0, 0, -0.7]}>
        <coneGeometry args={[0.06, 0.22, 8]} />
        <meshStandardMaterial
          color="#b7c0c8"
          metalness={0.66}
          roughness={0.26}
        />
      </mesh>
    </group>
  )
}

function getProjectilePalette(owner: TProjectileOwner): IProjectilePalette {
  switch (owner) {
    case 'monkey':
      return {
        blade: '#b2bcc3',
        bladeEdge: '#c1c9d0',
        handle: '#543625'
      }
    default:
      return {
        blade: '#d9e4ea',
        bladeEdge: '#eaf0f4',
        handle: '#7b5534'
      }
  }
}
