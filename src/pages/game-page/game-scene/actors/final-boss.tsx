import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { LoopRepeat, Mesh, Vector3, type Group } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { FINAL_BOSS_CONFIG } from '../../settings'

interface IFinalBoss {
  isVisible: boolean
  modelScale: number
  positionRef: RefObject<Vector3>
}

useGLTF.preload(FINAL_BOSS_CONFIG.modelUrl)

export function FinalBoss({ isVisible, modelScale, positionRef }: IFinalBoss) {
  const { animations, scene } = useGLTF(FINAL_BOSS_CONFIG.modelUrl)
  const [modelScene] = useState(() => clone(scene))
  const bossRef = useRef<Group | null>(null)
  const { actions } = useAnimations(animations, modelScene)

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
    })
  }, [modelScene])

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
    </group>
  )
}
