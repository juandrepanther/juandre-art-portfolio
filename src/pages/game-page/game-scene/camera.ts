import { Euler, Vector3 } from 'three'
import { PLAYER_START_POSITION } from '../helpers'
import {
  playerBodyGroundOffset,
  playerCameraAimPitch,
  playerCameraDistance,
  playerCameraHeight,
  worldUp
} from '../settings'
import { createLookDirection } from './helpers'

interface IResetCameraState {
  camera: {
    lookAt: (target: Vector3) => void
    position: Vector3
    quaternion: {
      setFromEuler: (euler: Euler) => void
    }
  }
  cameraForward: Vector3
  cameraLookDirection: Vector3
  cameraRight: Vector3
  playerPosition: Vector3
}

interface ISyncCameraState {
  camera: {
    getWorldDirection: (target: Vector3) => Vector3
    position: Vector3
  }
  cameraForward: Vector3
  cameraLookDirection: Vector3
  cameraRight: Vector3
}

export function createInitialPlayerPosition() {
  return new Vector3(
    PLAYER_START_POSITION[0],
    playerBodyGroundOffset,
    PLAYER_START_POSITION[2]
  )
}

export function resetCameraState({
  camera,
  cameraForward,
  cameraLookDirection,
  cameraRight,
  playerPosition
}: IResetCameraState) {
  camera.quaternion.setFromEuler(new Euler(playerCameraAimPitch, 0, 0, 'YXZ'))
  cameraLookDirection.copy(createLookDirection(0, playerCameraAimPitch))
  cameraForward.set(0, 0, -1)
  cameraRight.set(1, 0, 0)
  camera.position
    .set(...PLAYER_START_POSITION)
    .add(new Vector3(0, playerCameraHeight, playerCameraDistance))
  camera.lookAt(
    playerPosition.clone().add(cameraLookDirection.clone().multiplyScalar(18))
  )
}

export function syncCameraState({
  camera,
  cameraForward,
  cameraLookDirection,
  cameraRight
}: ISyncCameraState) {
  camera.getWorldDirection(cameraLookDirection)
  cameraForward.copy(cameraLookDirection)
  cameraForward.y = 0

  if (cameraForward.lengthSq() <= 0.0001) {
    cameraForward.set(0, 0, -1)
  } else {
    cameraForward.normalize()
  }

  cameraRight.crossVectors(cameraForward, worldUp).normalize()
}

export function updateCameraFollowPosition(
  cameraPosition: Vector3,
  playerPosition: Vector3,
  cameraForward: Vector3,
  delta: number
) {
  const desiredCameraPosition = playerPosition
    .clone()
    .add(new Vector3(0, playerCameraHeight, 0))
    .add(cameraForward.clone().multiplyScalar(-playerCameraDistance))

  cameraPosition.lerp(desiredCameraPosition, 1 - Math.exp(-delta * 10))
}
