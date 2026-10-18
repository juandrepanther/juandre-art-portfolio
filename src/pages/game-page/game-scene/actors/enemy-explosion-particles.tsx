import type { RefObject } from 'react'
import { ENEMY_EXPLOSION_PARTICLE_POOL_SIZE } from '../../settings'
import { ExplosionParticles } from './explosion-particles'
import type { IEnemyExplosionParticleState } from '../types'

interface IEnemyExplosionParticles {
  particleStatesRef: RefObject<IEnemyExplosionParticleState[]>
}

export function EnemyExplosionParticles({
  particleStatesRef
}: IEnemyExplosionParticles) {
  return (
    <ExplosionParticles
      color="#ffb15c"
      emissive="#ff7a2d"
      emissiveIntensity={1.35}
      particlePoolSize={ENEMY_EXPLOSION_PARTICLE_POOL_SIZE}
      particleStatesRef={particleStatesRef}
    />
  )
}
