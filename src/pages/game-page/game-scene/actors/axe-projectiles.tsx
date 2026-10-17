import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import axeModelUrl from 'assets/models/axe.glb?url'
import { Mesh, MeshStandardMaterial, type Group } from 'three'
import { PROJECTILE_POOL_SIZE } from '../../settings'
import type { IProjectileState, TProjectileOwner } from '../types'

interface IAxeProjectiles {
  projectilesRef: RefObject<IProjectileState[]>
}

interface IAxeProjectile {
  index: number
  projectilesRef: RefObject<IProjectileState[]>
}

interface IProjectilePalette {
  tint: string
}

const axeModelScale = 0.62
const axeModelPosition: [number, number, number] = [0.2725, 0.06, 0]
const axeModelRotation: [number, number, number] = [Math.PI / 2, Math.PI / 2, 0]

useGLTF.preload(axeModelUrl)

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
  const { scene } = useGLTF(axeModelUrl)
  const [modelScene] = useState(() => scene.clone(true))
  const axeRef = useRef<Group | null>(null)
  const tintMaterialsRef = useRef<MeshStandardMaterial[]>([])
  const tintedOwnerRef = useRef<TProjectileOwner | null>(null)

  useEffect(() => {
    const tintMaterials = new Set<MeshStandardMaterial>()

    modelScene.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return
      }

      object.castShadow = true
      object.receiveShadow = false
      object.frustumCulled = false

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      for (const material of materials) {
        if (material instanceof MeshStandardMaterial) {
          material.vertexColors = true
          tintMaterials.add(material)
        }
      }
    })

    tintMaterialsRef.current = [...tintMaterials]
  }, [modelScene])

  useFrame(() => {
    const projectileState = projectilesRef.current[index]

    if (!axeRef.current || !projectileState) {
      return
    }

    axeRef.current.visible = projectileState.active
    axeRef.current.position.copy(projectileState.position)

    if (tintedOwnerRef.current !== projectileState.owner) {
      const palette = getProjectilePalette(projectileState.owner)

      for (const material of tintMaterialsRef.current) {
        material.color.set(palette.tint)
      }

      tintedOwnerRef.current = projectileState.owner
    }

    if (projectileState.velocity.lengthSq() > 0) {
      axeRef.current.rotation.z -= 0.18
    }
  })

  return (
    <group ref={axeRef}>
      <group
        position={axeModelPosition}
        rotation={axeModelRotation}
        scale={axeModelScale}
      >
        <primitive object={modelScene} />
      </group>
    </group>
  )
}

function getProjectilePalette(owner: TProjectileOwner): IProjectilePalette {
  switch (owner) {
    case 'enemy':
      return {
        tint: '#b7b0a2'
      }
    default:
      return {
        tint: '#d32f30'
      }
  }
}
