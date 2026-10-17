import { Vector3 } from 'three'
import type { TDifficultyLevel } from '../helpers'
import {
  HARDCORE_ENEMY_FLIGHT_PROXIMITY,
  HARDCORE_ENEMY_FLIGHT_SPEED,
  PLAYER_MOVE_SPEED,
  PLAYER_FACING_TURN_SPEED
} from '../settings'
import { createRandomEnemyFlightPosition } from './helpers'
import type { IControlsState, IEnemyState } from './types'

interface IUpdatePlayerMovement {
  cameraForward: Vector3
  cameraRight: Vector3
  controls: IControlsState
  delta: number
  playerVelocity: Vector3
}

export function updatePlayerMovement({
  cameraForward,
  cameraRight,
  controls,
  delta,
  playerVelocity
}: IUpdatePlayerMovement) {
  const forwardInput = Number(controls.forward) - Number(controls.backward)
  const strafeInput = Number(controls.right) - Number(controls.left)
  const movementAxis = cameraForward
    .clone()
    .multiplyScalar(forwardInput)
    .add(cameraRight.clone().multiplyScalar(strafeInput))

  if (movementAxis.lengthSq() > 0) {
    movementAxis.normalize().multiplyScalar(PLAYER_MOVE_SPEED)
    playerVelocity.lerp(movementAxis, 1 - Math.exp(-delta * 8))
    return
  }

  playerVelocity.lerp(new Vector3(0, 0, 0), 1 - Math.exp(-delta * 7))
}

export function updatePlayerFacing(
  desiredFacing: Vector3,
  playerDirection: Vector3,
  cameraForward: Vector3,
  delta: number
) {
  desiredFacing.copy(cameraForward)
  playerDirection.lerp(
    desiredFacing,
    1 - Math.exp(-delta * PLAYER_FACING_TURN_SPEED)
  )
}

export function applyEnemyTravelByDifficulty(
  enemyState: IEnemyState,
  difficulty: TDifficultyLevel,
  delta: number
) {
  switch (difficulty) {
    case 'Hardcore': {
      const travelToTarget = enemyState.targetPosition
        .clone()
        .sub(enemyState.position)

      if (
        travelToTarget.lengthSq() <=
        HARDCORE_ENEMY_FLIGHT_PROXIMITY * HARDCORE_ENEMY_FLIGHT_PROXIMITY
      ) {
        enemyState.targetPosition.copy(createRandomEnemyFlightPosition())
        return
      }

      enemyState.position.addScaledVector(
        travelToTarget.normalize(),
        delta * HARDCORE_ENEMY_FLIGHT_SPEED
      )
      return
    }
    default:
      enemyState.position.lerp(
        enemyState.homePosition,
        1 - Math.exp(-delta * 6)
      )
  }
}

export function resetEnemyForDifficulty(
  enemyState: IEnemyState,
  difficulty: TDifficultyLevel,
  nextThrowAt: number
) {
  enemyState.active = true

  switch (difficulty) {
    case 'Hardcore':
      enemyState.position.copy(createRandomEnemyFlightPosition())
      enemyState.targetPosition.copy(createRandomEnemyFlightPosition())
      break
    default:
      enemyState.position.copy(enemyState.homePosition)
      break
  }

  enemyState.nextThrowAt = nextThrowAt
}
