import { useGLTF } from '@react-three/drei'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { Color, Material, Mesh, MeshStandardMaterial } from 'three'
import type { Group } from 'three'
import { CHARACTER_CONFIGS, type ICharacterConfig } from '../settings'

interface ICharacterModel {
  characterConfig: ICharacterConfig
  children?: ReactNode
  groundOffset: number
  groupRef?: RefObject<Group | null>
  isHitFlashing?: boolean
  modelTransformOverride?: {
    offset: [number, number, number]
    rotation: [number, number, number]
    scale: number
  }
}

const playerHitFlashColor = new Color('#ff3b30')

for (const { modelUrl } of Object.values(CHARACTER_CONFIGS)) {
  useGLTF.preload(modelUrl)
}

function CharacterModel({
  characterConfig,
  children,
  groundOffset,
  groupRef,
  isHitFlashing = false,
  modelTransformOverride
}: ICharacterModel) {
  const { scene } = useGLTF(characterConfig.modelUrl)
  const [modelScene] = useState(() => scene.clone(true))
  const baseMaterialColorsRef = useRef(new WeakMap<Material, Color>())

  const syncMaterialColors = useEffectEvent((isFlashing: boolean) => {
    modelScene.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return
      }

      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material]

      for (const material of materials) {
        if (!(material instanceof MeshStandardMaterial)) {
          continue
        }

        const baseColor = baseMaterialColorsRef.current.get(material)

        if (!baseColor) {
          continue
        }

        material.color.copy(isFlashing ? playerHitFlashColor : baseColor)
      }
    })
  })

  useEffect(() => {
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
        if (
          material instanceof MeshStandardMaterial &&
          !baseMaterialColorsRef.current.has(material)
        ) {
          baseMaterialColorsRef.current.set(material, material.color.clone())
        }
      }
    })
  }, [modelScene])

  useEffect(() => {
    syncMaterialColors(isHitFlashing)

    return () => {
      syncMaterialColors(false)
    }
  }, [isHitFlashing])

  const modelScale = modelTransformOverride?.scale ?? characterConfig.modelScale
  const modelOffset =
    modelTransformOverride?.offset ?? characterConfig.modelOffset
  const modelRotation =
    modelTransformOverride?.rotation ?? characterConfig.modelRotation

  return (
    <group ref={groupRef} scale={modelScale}>
      <group
        position={[
          modelOffset[0],
          -groundOffset + modelOffset[1],
          modelOffset[2]
        ]}
        rotation={modelRotation}
      >
        <primitive object={modelScene} />
      </group>
      {children}
    </group>
  )
}

export default CharacterModel
