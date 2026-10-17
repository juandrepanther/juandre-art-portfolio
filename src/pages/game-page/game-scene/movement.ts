import { Vector3 } from 'three'
import { PLAYER_MOVE_SPEED, type TDifficultyLevel } from '../helpers'
import {
  hardcoreMonkeyFlightProximity,
  hardcoreMonkeyFlightSpeed,
  playerFacingTurnSpeed
} from '../settings'
import { createRandomMonkeyFlightPosition } from './helpers'
import type { IControlsState, IMonkeyState } from './types'

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
    1 - Math.exp(-delta * playerFacingTurnSpeed)
  )
}

export function applyMonkeyTravelByDifficulty(
  monkeyState: IMonkeyState,
  difficulty: TDifficultyLevel,
  delta: number
) {
  switch (difficulty) {
    case 'Hardcore': {
      const travelToTarget = monkeyState.targetPosition
        .clone()
        .sub(monkeyState.position)

      if (
        travelToTarget.lengthSq() <=
        hardcoreMonkeyFlightProximity * hardcoreMonkeyFlightProximity
      ) {
        monkeyState.targetPosition.copy(createRandomMonkeyFlightPosition())
        return
      }

      monkeyState.position.addScaledVector(
        travelToTarget.normalize(),
        delta * hardcoreMonkeyFlightSpeed
      )
      return
    }
    default:
      monkeyState.position.lerp(
        monkeyState.homePosition,
        1 - Math.exp(-delta * 6)
      )
  }
}

export function resetMonkeyForDifficulty(
  monkeyState: IMonkeyState,
  difficulty: TDifficultyLevel,
  nextThrowAt: number
) {
  monkeyState.active = true

  switch (difficulty) {
    case 'Hardcore':
      monkeyState.position.copy(createRandomMonkeyFlightPosition())
      monkeyState.targetPosition.copy(createRandomMonkeyFlightPosition())
      break
    default:
      monkeyState.position.copy(monkeyState.homePosition)
      break
  }

  monkeyState.nextThrowAt = nextThrowAt
}
