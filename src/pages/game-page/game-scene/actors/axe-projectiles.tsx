import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshStandardMaterial as ThreeMeshStandardMaterial, type Group } from 'three'
import { PROJECTILE_POOL_SIZE } from '../../settings'
import type {
  IProjectileState,
  TProjectileOwner
} from '../types'

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

export function AxeProjectiles({ projectilesRef }: IAxeProjectiles) {
  return (
    <group>
      {Array.from({ length: PROJECTILE_POOL_SIZE }, (_, index) => (
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