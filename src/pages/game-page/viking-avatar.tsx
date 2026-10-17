import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useEffectEvent } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import type { RefObject } from 'react'
import lowPolyVikingModelUrl from 'assets/models/low_poly_viking.glb?url'
import { Color, Material, Mesh, MeshStandardMaterial } from 'three'
import type { Group } from 'three'

interface IVikingAvatar {
  groundOffset: number
  isHitFlashing: boolean
  playerRef: RefObject<Group | null>
}

const vikingModelScale = 1
const vikingModelCenterX = 0.25
const vikingModelGroundOffset = 0.08
const vikingModelCenterZ = -0.1065
const vikingModelRotation: [number, number, number] = [-Math.PI / 2, 0, 0]
const playerHitFlashColor = new Color('#ff3b30')

useGLTF.preload(lowPolyVikingModelUrl)

function VikingAvatar({
  groundOffset,
  isHitFlashing,
  playerRef
}: IVikingAvatar) {
  const { scene } = useGLTF(lowPolyVikingModelUrl)
  const [modelScene] = useState(() => scene.clone(true))
  const modelRef = useRef<Group | null>(null)
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
      if (object instanceof Mesh) {
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
      }
    })
  }, [modelScene])

  useEffect(() => {
    syncMaterialColors(isHitFlashing)

    return () => {
      syncMaterialColors(false)
    }
  }, [isHitFlashing, modelScene])

  return (
    <group ref={playerRef} scale={vikingModelScale}>
      <group
        ref={modelRef}
        position={[
          vikingModelCenterX,
          -groundOffset - vikingModelGroundOffset,
          vikingModelCenterZ
        ]}
        rotation={vikingModelRotation}
      >
        <primitive object={modelScene} />
      </group>
    </group>
  )
}

export default VikingAvatar
