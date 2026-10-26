import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useEffectEvent, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  Color,
  LoopRepeat,
  Material,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  type Group
} from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import BossHealthMeter from '../boss-health-meter'
import { FINAL_BOSS_CONFIG } from '../../settings'

interface IFinalBoss {
  health: number
  isMobileViewport: boolean
  isHitFlashing: boolean
  isVisible: boolean
  modelScale: number
  positionRef: RefObject<Vector3>
}

const bossHitFlashColor = new Color('#ff3b30')

useGLTF.preload(FINAL_BOSS_CONFIG.modelUrl)

export function FinalBoss({
  health,
  isMobileViewport,
  isHitFlashing,
  isVisible,
  modelScale,
  positionRef
}: IFinalBoss) {
  const { animations, scene } = useGLTF(FINAL_BOSS_CONFIG.modelUrl)
  const [modelScene] = useState(() => clone(scene))
  const bossRef = useRef<Group | null>(null)
  const baseMaterialColorsRef = useRef(new WeakMap<Material, Color>())
  const { actions } = useAnimations(animations, modelScene)

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

        material.color.copy(isFlashing ? bossHitFlashColor : baseColor)
      }
    })
  })

  useEffect(() => {
    const takeAction = actions['Take 001'] ?? Object.values(actions)[0]

    if (!takeAction) {
      return
    }

    if (isVisible) {
      takeAction.enabled = true
      takeAction.setLoop(LoopRepeat, Number.POSITIVE_INFINITY)
      takeAction.clampWhenFinished = false
      takeAction.fadeIn(0.2).play()
      return
    }

    takeAction.fadeOut(0.15)
  }, [actions, isVisible])

  useEffect(() => {
    modelScene.traverse((object) => {
      if (!(object instanceof Mesh)) {
        return
      }

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

  useFrame(() => {
    if (!bossRef.current) {
      return
    }

    bossRef.current.visible = isVisible

    if (!isVisible) {
      return
    }

    bossRef.current.position.copy(positionRef.current)
  })

  return (
    <group
      key={modelScale}
      ref={bossRef}
      scale={[modelScale, modelScale, modelScale]}
      visible={false}
    >
      <primitive object={modelScene} />
      {isVisible ? (
        <BossHealthMeter health={health} isMobileViewport={isMobileViewport} />
      ) : null}
    </group>
  )
}
