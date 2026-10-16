import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useEffectEvent } from 'react'
import { useRef } from 'react'
import type { RefObject } from 'react'
import {
  Box3,
  Color,
  Material,
  Mesh,
  MeshStandardMaterial,
  Vector3
} from 'three'
import type { Group } from 'three'

interface IVikingAvatar {
  groundOffset: number
  isHitFlashing: boolean
  playerRef: RefObject<Group | null>
}

const lowPolyVikingModelUrl = new URL(
  'assets/models/low_poly_viking.glb',
  import.meta.url
).href

const vikingModelScale = 1
const playerHitFlashColor = new Color('#ff3b30')

useGLTF.preload(lowPolyVikingModelUrl)

function VikingAvatar({
  groundOffset,
  isHitFlashing,
  playerRef
}: IVikingAvatar) {
  const { scene } = useGLTF(lowPolyVikingModelUrl)
  const modelRef = useRef<Group | null>(null)
  const baseMaterialColorsRef = useRef(new WeakMap<Material, Color>())

  const syncMaterialColors = useEffectEvent((isFlashing: boolean) => {
    scene.traverse((object) => {
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
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = false
        object.receiveShadow = false

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
  }, [scene])

  useEffect(() => {
    if (!modelRef.current) {
      return
    }

    const bounds = new Box3().setFromObject(modelRef.current)
    const center = new Vector3()

    bounds.getCenter(center)

    modelRef.current.position.set(
      -center.x,
      -bounds.min.y - groundOffset,
      -center.z
    )
  }, [groundOffset, scene])

  useEffect(() => {
    syncMaterialColors(isHitFlashing)

    return () => {
      syncMaterialColors(false)
    }
  }, [isHitFlashing, scene])

  return (
    <group ref={playerRef} position={[0, -2, 0]} scale={vikingModelScale}>
      <group ref={modelRef} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

export default VikingAvatar
