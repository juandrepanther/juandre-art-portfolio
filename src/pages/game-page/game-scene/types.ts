import { Vector3 } from 'three'

export type TProjectileOwner = 'enemy' | 'player'

export type TTreeVariant = 0 | 1 | 2

export interface IProjectileState {
  active: boolean
  owner: TProjectileOwner
  position: Vector3
  ttl: number
  velocity: Vector3
}

export interface IEnemyState {
  active: boolean
  animationOffset: number
  homePosition: Vector3
  nextThrowAt: number
  position: Vector3
  respawnAt: number
  rotationY: number
  targetPosition: Vector3
}

export interface IEnemyExplosionParticleState {
  active: boolean
  maxTtl: number
  position: Vector3
  scale: number
  ttl: number
  velocity: Vector3
}

export interface IPainkillerState {
  active: boolean
  animationOffset: number
  position: Vector3
  respawnAt: number
}

export interface IControlsState {
  backward: boolean
  forward: boolean
  left: boolean
  right: boolean
}
