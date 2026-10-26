import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import accordionModelUrl from 'assets/models/accordion.glb?url'
import axeModelUrl from 'assets/models/axe.glb?url'
import drumStickModelUrl from 'assets/models/drum_stick.glb?url'
import drumsModelUrl from 'assets/models/drums.glb?url'
import micModelUrl from 'assets/models/mic.glb?url'
import spearModelUrl from 'assets/models/spear.glb?url'
import swordModelUrl from 'assets/models/sword.glb?url'
import wildBoarModelUrl from 'assets/models/wild_boar.glb?url'
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
  owner: IProjectileState['owner']
  weapon: TWeapon
  onTintMaterialsReady: (materials: MeshStandardMaterial[]) => void
}

interface IProjectileTint {
  color: string
  emissive: string
  emissiveIntensity: number
}

const projectileTints: Record<IProjectileState['owner'], IProjectileTint> = {
  player: {
    color: '#f5f5f5',
    emissive: '#121212',
    emissiveIntensity: 0.1
  },
  enemy: {
    color: '#ffdcb8',
    emissive: '#5a2f1a',
    emissiveIntensity: 0.4
  },
  boss: {
    color: '#ffe48a',
    emissive: '#ffd632',
    emissiveIntensity: 1.7
  }
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
  },
  mic: {
    position: [0.2725, 0.06, 0],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 2],
    scale: 0.62
  },
  drum_stick: {
    position: [0.2725, 0.06, 0],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 2],
    scale: 4.62
  },
  drums: {
    position: [0.2725, 0.06, 0],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 2],
    scale: 0.62
  },
  wild_boar: {
    position: [0.2725, 0.06, 0],
    rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 2],
    scale: 0.62
  },
  spear: {
    position: [0.2725, 0.06, 0],
    rotation: [0, 0, 0],
    scale: 0.62
  }
}

const projectileModelUrls: Record<TWeapon, string> = {
  axe: axeModelUrl,
  accordion: accordionModelUrl,
  drum_stick: drumStickModelUrl,
  drums: drumsModelUrl,
  mic: micModelUrl,
  spear: spearModelUrl,
  sword: swordModelUrl,
  wild_boar: wildBoarModelUrl
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
  const [currentWeapon, setCurrentWeapon] = useState<TWeapon>('axe')
  const [currentOwner, setCurrentOwner] =
    useState<IProjectileState['owner']>('player')

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
    if (currentOwner !== projectileState.owner) {
      setCurrentOwner(projectileState.owner)
    }

    if (projectileState.velocity.lengthSq() > 0) {
      projectileRef.current.rotation.z -= 0.18
    }
  })

  return (
    <group ref={projectileRef}>
      {currentOwner === 'boss' ? (
        <mesh>
          <sphereGeometry args={[0.58, 20, 20]} />
          <meshStandardMaterial
            color="#ffe783"
            emissive="#ffd632"
            emissiveIntensity={10}
            metalness={1.0}
            roughness={0}
          />
        </mesh>
      ) : (
        <ProjectileModel
          owner={currentOwner}
          key={currentWeapon}
          onTintMaterialsReady={() => {}}
          weapon={currentWeapon}
        />
      )}
    </group>
  )
}

function ProjectileModel({
  owner,
  weapon,
  onTintMaterialsReady
}: IProjectileModel) {
  const { scene } = useGLTF(projectileModelUrls[weapon])
  const [modelScene] = useState(() => scene.clone(true))

  useEffect(() => {
    const tintMaterials = new Set<MeshStandardMaterial>()

    modelScene.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return
      }

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

    const tint = projectileTints[owner]

    for (const material of tintMaterials) {
      material.color.set(tint.color)
      material.emissive.set(tint.emissive)
      material.emissiveIntensity = tint.emissiveIntensity
    }

    onTintMaterialsReady([...tintMaterials])
  }, [modelScene, onTintMaterialsReady, owner])

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
