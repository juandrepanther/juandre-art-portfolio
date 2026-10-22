import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import type { RefObject } from 'react'
import enemyModelUrl from 'assets/models/enemy.glb?url'
import { Mesh } from 'three'
import type { Group } from 'three'
import type { IEnemyState } from '../types'

interface IEnemy {
  enemyStateRef: RefObject<IEnemyState[]>
  enemyCount: number
  isMobileViewport: boolean
}

interface IEnemyUnit {
  enemyStateRef: RefObject<IEnemyState[]>
  index: number
  isMobileViewport: boolean
}

const enemyModelScale = 0.3
const enemyModelPosition: [number, number, number] = [0, 0, 0]
const enemyModelRotation: [number, number, number] = [0, 0, 0]
const enemyMobileBulbPosition: [number, number, number] = [0, 1.08, 0]
const enemyMobileBulbRadius = 0.09
const enemyMobileBulbGlowRadius = 0.21
const enemyMobileBulbLightDistance = 3.4
const enemyMobileBulbLightIntensity = 6.2

useGLTF.preload(enemyModelUrl)

export function Enemy({ enemyCount, enemyStateRef, isMobileViewport }: IEnemy) {
  return (
    <group>
      {Array.from({ length: enemyCount }, (_, index) => (
        <EnemyUnit
          enemyStateRef={enemyStateRef}
          index={index}
          isMobileViewport={isMobileViewport}
          key={`enemy-${index}`}
        />
      ))}
    </group>
  )
}

function EnemyUnit({ enemyStateRef, index, isMobileViewport }: IEnemyUnit) {
  const { scene } = useGLTF(enemyModelUrl)
  const [modelScene] = useState(() => scene.clone(true))
  const enemyRef = useRef<Group | null>(null)
  const enemyModelRef = useRef<Group | null>(null)

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
    const enemyState = enemyStateRef.current[index]

    if (!enemyRef.current || !enemyState) {
      return
    }

    enemyRef.current.visible = enemyState.active
    enemyRef.current.position.copy(enemyState.position)
    enemyRef.current.rotation.y = enemyState.rotationY

    enemyRef.current.position.y +=
      Math.sin(clock.elapsedTime * 3 + enemyState.animationOffset) * 0.06
  })

  return (
    <group ref={enemyRef}>
      <group
        ref={enemyModelRef}
        position={enemyModelPosition}
        rotation={enemyModelRotation}
        scale={enemyModelScale}
      >
        <primitive object={modelScene} />
      </group>
      {isMobileViewport ? (
        <group position={enemyMobileBulbPosition}>
          <pointLight
            color="#ffe199"
            decay={1.2}
            distance={enemyMobileBulbLightDistance}
            intensity={enemyMobileBulbLightIntensity}
          />
          <mesh>
            <sphereGeometry args={[enemyMobileBulbRadius, 14, 14]} />
            <meshBasicMaterial color="#fff8de" toneMapped={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[enemyMobileBulbGlowRadius, 14, 14]} />
            <meshBasicMaterial
              color="#ffd47a"
              opacity={0.4}
              toneMapped={false}
              transparent
            />
          </mesh>
        </group>
      ) : null}
    </group>
  )
}
