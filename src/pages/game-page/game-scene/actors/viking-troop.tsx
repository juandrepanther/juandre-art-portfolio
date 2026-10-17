import { useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import type { ITreeLayout } from '../../helpers'
import { AnimatedSurfaceMaterial } from '../lighting'
import type { IMonkeyState } from '../types'

interface IVikingTroop {
  monkeyStateRef: RefObject<IMonkeyState[]>
  treeLayouts: ITreeLayout[]
}

interface IVikingEnemy {
  index: number
  monkeyStateRef: RefObject<IMonkeyState[]>
}

export function VikingTroop({ monkeyStateRef, treeLayouts }: IVikingTroop) {
  return (
    <group>
      {treeLayouts.map((_, index) => (
        <VikingEnemy
          index={index}
          key={`monkey-${index}`}
          monkeyStateRef={monkeyStateRef}
        />
      ))}
    </group>
  )
}

function VikingEnemy({ index, monkeyStateRef }: IVikingEnemy) {
  const monkeyRef = useRef<Group | null>(null)

  useFrame(({ clock }) => {
    const monkeyState = monkeyStateRef.current[index]

    if (!monkeyRef.current || !monkeyState) {
      return
    }

    monkeyRef.current.visible = monkeyState.active
    monkeyRef.current.position.copy(monkeyState.position)
    monkeyRef.current.rotation.y = monkeyState.rotationY
    monkeyRef.current.position.y +=
      Math.sin(clock.elapsedTime * 3 + monkeyState.animationOffset) * 0.06
  })

  return (
    <group ref={monkeyRef}>
      <mesh castShadow position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.42, 0.8, 8, 12]} />
        <AnimatedSurfaceMaterial
          accentColor="#d8dbe0"
          amplitude={0.05}
          baseColor="#6d737b"
        />
      </mesh>
      <mesh castShadow position={[0, 1.7, 0.12]}>
        <sphereGeometry args={[0.34, 18, 18]} />
        <AnimatedSurfaceMaterial
          accentColor="#ecd2b0"
          amplitude={0.04}
          baseColor="#d7a06b"
        />
      </mesh>
      <mesh castShadow position={[0, 2.05, 0.08]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.42, 0.48, 0.42, 10]} />
        <meshStandardMaterial
          color="#8b9298"
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>
      <mesh castShadow position={[0.46, 2.1, 0.1]} rotation={[0, 0, -0.65]}>
        <coneGeometry args={[0.12, 0.64, 8]} />
        <meshStandardMaterial
          color="#cfd6dc"
          metalness={0.45}
          roughness={0.38}
        />
      </mesh>
      <mesh castShadow position={[-0.46, 2.1, 0.1]} rotation={[0, 0, 0.65]}>
        <coneGeometry args={[0.12, 0.64, 8]} />
        <meshStandardMaterial
          color="#cfd6dc"
          metalness={0.45}
          roughness={0.38}
        />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0.22]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.24, 0.48, 8]} />
        <meshStandardMaterial color="#6f4a2e" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.35, 1.75, 0.38]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#241b18" />
      </mesh>
      <mesh castShadow position={[-0.35, 1.75, 0.38]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#241b18" />
      </mesh>
    </group>
  )
}