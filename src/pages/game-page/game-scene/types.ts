import { Vector3 } from 'three'
import type { TWeapon } from '../settings'

export type TProjectileOwner = 'boss' | 'enemy' | 'player'
export type { TWeapon }
export type TFloatingCombatTextSource = 'enemy' | 'painkiller' | 'tnt'

export type TTreeVariant = 0 | 1 | 2

export interface IProjectileState {
  active: boolean
  owner: TProjectileOwner
  position: Vector3
  weapon: TWeapon
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

export interface ITntBoxState {
  active: boolean
  position: Vector3
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

export interface IFloatingCombatTextState {
  active: boolean
  maxTtl: number
  position: Vector3
  source: TFloatingCombatTextSource
  ttl: number
  value: number
  velocity: Vector3
}
