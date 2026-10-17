import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import type { RefObject } from 'react'
import painkillerModelUrl from 'assets/models/painkiller.glb?url'
import { Mesh } from 'three'
import type { Group } from 'three'
import type { ITreeLayout } from '../../helpers'
import type { IPainkillerState } from '../types'

interface IPainkillerPickups {
  painkillerStateRef: RefObject<IPainkillerState[]>
  treeLayouts: ITreeLayout[]
}

interface IPainkillerPickup {
  painkillerStateRef: RefObject<IPainkillerState[]>
  index: number
}

const painkillerModelScale = 0.5
const painkillerModelPosition: [number, number, number] = [0, -0.2, 0]
const painkillerModelRotation: [number, number, number] = [0, 0, 0]

useGLTF.preload(painkillerModelUrl)

export function PainkillerPickups({
  painkillerStateRef,
  treeLayouts
}: IPainkillerPickups) {
  return (
    <group>
      {treeLayouts.map((_, index) => (
        <PainkillerPickup
          index={index}
          key={`painkiller-${index}`}
          painkillerStateRef={painkillerStateRef}
        />
      ))}
    </group>
  )
}

function PainkillerPickup({ painkillerStateRef, index }: IPainkillerPickup) {
  const { scene } = useGLTF(painkillerModelUrl)
  const [modelScene] = useState(() => scene.clone(true))
  const painkillerRef = useRef<Group | null>(null)

  useEffect(() => {
    modelScene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true
        object.receiveShadow = false
        object.frustumCulled = false
      }
    })
  }, [modelScene])

  useFrame(({ clock }) => {
    const painkillerState = painkillerStateRef.current[index]

    if (!painkillerRef.current || !painkillerState) {
      return
    }

    painkillerRef.current.visible = painkillerState.active
    painkillerRef.current.position.copy(painkillerState.position)
    painkillerRef.current.position.y +=
      Math.sin(clock.elapsedTime * 2 + painkillerState.animationOffset) * 0.12
    painkillerRef.current.rotation.y = clock.elapsedTime * 1.4
  })

  return (
    <group ref={painkillerRef}>
      <group
        position={painkillerModelPosition}
        rotation={painkillerModelRotation}
        scale={painkillerModelScale}
      >
        <primitive object={modelScene} />
      </group>
    </group>
  )
}
