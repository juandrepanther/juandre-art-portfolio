import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import accordionModelUrl from 'assets/models/accordion.glb?url'
import axeModelUrl from 'assets/models/axe.glb?url'
import swordModelUrl from 'assets/models/sword.glb?url'
import { Mesh, MeshStandardMaterial, type Group } from 'three'
import { PROJECTILE_POOL_SIZE, type TWeapon } from '../../settings'
import type { IProjectileState } from '../types'

interface IAxeProjectiles {
  projectilesRef: RefObject<IProjectileState[]>
}

interface IAxeProjectile {
  index: number
  projectilesRef: RefObject<IProjectileState[]>
}

interface IProjectileTransform {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}

interface IProjectileModel {
  weapon: TWeapon
  onTintMaterialsReady: (materials: MeshStandardMaterial[]) => void
}

const projectileTransforms: Record<TWeapon, IProjectileTransform> = {
  axe: {
    position: [0.2725, 0.06, 0],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 4],
    scale: 0.62
  },
  sword: {
    position: [0.2725, 0.06, 0],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 4],
    scale: 0.62
  },
  accordion: {
    position: [0.2725, 0.06, 0],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 2],
    scale: 0.62
  }
}

const projectileModelUrls: Record<TWeapon, string> = {
  axe: axeModelUrl,
  accordion: accordionModelUrl,
  sword: swordModelUrl
}

for (const modelUrl of Object.values(projectileModelUrls)) {
  useGLTF.preload(modelUrl)
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
  const projectileRef = useRef<Group | null>(null)
  const tintMaterialsRef = useRef<MeshStandardMaterial[]>([])
  const [currentWeapon, setCurrentWeapon] = useState<TWeapon>('axe')

  useFrame(() => {
    const projectileState = projectilesRef.current[index]

    if (!projectileRef.current || !projectileState) {
      return
    }

    projectileRef.current.visible = projectileState.active
    projectileRef.current.position.copy(projectileState.position)

    if (currentWeapon !== projectileState.weapon) {
      setCurrentWeapon(projectileState.weapon)
    }

    if (projectileState.velocity.lengthSq() > 0) {
      projectileRef.current.rotation.z -= 0.18
    }
  })

  return (
    <group ref={projectileRef}>
      <ProjectileModel
        key={currentWeapon}
        onTintMaterialsReady={(materials) => {
          tintMaterialsRef.current = materials
        }}
        weapon={currentWeapon}
      />
    </group>
  )
}

function ProjectileModel({ weapon, onTintMaterialsReady }: IProjectileModel) {
  const { scene } = useGLTF(projectileModelUrls[weapon])
  const [modelScene] = useState(() => scene.clone(true))

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

    onTintMaterialsReady([...tintMaterials])
  }, [modelScene, onTintMaterialsReady])

  const projectileTransform = projectileTransforms[weapon]

  return (
    <group
      position={projectileTransform.position}
      rotation={projectileTransform.rotation}
      scale={projectileTransform.scale}
    >
      <primitive object={modelScene} />
    </group>
  )
}
