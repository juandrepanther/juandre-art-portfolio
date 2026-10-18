import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import { Mesh } from 'three'
import {
  ENEMY_EXPLOSION_PARTICLE_BASE_SCALE,
  ENEMY_EXPLOSION_PARTICLE_GRAVITY
} from '../../settings'
import type { IEnemyExplosionParticleState } from '../types'

interface IExplosionParticles {
  color: string
  emissive: string
  emissiveIntensity: number
  particlePoolSize: number
  particleStatesRef: RefObject<IEnemyExplosionParticleState[]>
}

export function ExplosionParticles({
  color,
  emissive,
  emissiveIntensity,
  particlePoolSize,
  particleStatesRef
}: IExplosionParticles) {
  const meshRefs = useRef<Array<Mesh | null>>([])

  useFrame((_, delta) => {
    const particleStates = particleStatesRef.current

    for (let index = 0; index < particleStates.length; index += 1) {
      const particleState = particleStates[index]
      const mesh = meshRefs.current[index]

      if (!mesh) {
        continue
      }

      if (!particleState.active) {
        mesh.visible = false
        continue
      }

      particleState.ttl -= delta

      if (particleState.ttl <= 0) {
        particleState.active = false
        mesh.visible = false
        continue
      }

      particleState.velocity.y -= ENEMY_EXPLOSION_PARTICLE_GRAVITY * delta
      particleState.position.addScaledVector(particleState.velocity, delta)

      const lifeRatio = particleState.ttl / particleState.maxTtl
      const scale = particleState.scale * (0.65 + lifeRatio * 0.9)

      mesh.visible = true
      mesh.position.copy(particleState.position)
      mesh.scale.setScalar(
        Math.max(ENEMY_EXPLOSION_PARTICLE_BASE_SCALE * 0.6, scale)
      )
    }
  })

  return (
    <group>
      {Array.from({ length: particlePoolSize }, (_, index) => (
        <mesh
          key={`explosion-particle-${index}`}
          ref={(mesh) => {
            meshRefs.current[index] = mesh
          }}
          visible={false}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            roughness={0.25}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  )
}
