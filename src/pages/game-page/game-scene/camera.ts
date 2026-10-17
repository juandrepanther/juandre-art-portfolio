import { Euler, Vector3 } from 'three'
import { PLAYER_START_POSITION } from '../helpers'
import {
  PLAYER_BODY_GROUND_OFFSET,
  PLAYER_CAMERA_AIM_PITCH,
  PLAYER_CAMERA_DISTANCE,
  PLAYER_CAMERA_HEIGHT,
  WORLD_UP
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
    PLAYER_BODY_GROUND_OFFSET,
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
  camera.quaternion.setFromEuler(
    new Euler(PLAYER_CAMERA_AIM_PITCH, 0, 0, 'YXZ')
  )
  cameraLookDirection.copy(createLookDirection(0, PLAYER_CAMERA_AIM_PITCH))
  cameraForward.set(0, 0, -1)
  cameraRight.set(1, 0, 0)
  camera.position
    .set(...PLAYER_START_POSITION)
    .add(new Vector3(0, PLAYER_CAMERA_HEIGHT, PLAYER_CAMERA_DISTANCE))
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

  cameraRight.crossVectors(cameraForward, WORLD_UP).normalize()
}

export function updateCameraFollowPosition(
  cameraPosition: Vector3,
  playerPosition: Vector3,
  cameraForward: Vector3,
  delta: number
) {
  const desiredCameraPosition = playerPosition
    .clone()
    .add(new Vector3(0, PLAYER_CAMERA_HEIGHT, 0))
    .add(cameraForward.clone().multiplyScalar(-PLAYER_CAMERA_DISTANCE))

  cameraPosition.lerp(desiredCameraPosition, 1 - Math.exp(-delta * 10))
}
