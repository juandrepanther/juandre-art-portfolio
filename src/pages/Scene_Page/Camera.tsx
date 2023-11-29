import { useFrame, useThree } from '@react-three/fiber'
import { isMobile } from 'react-device-detect'
import CameraControls from 'camera-controls'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import * as THREE from 'three'
import {
  distanceFromCameraToObject,
  lockedCamera_startPosition,
  lockedCamera_targetPosition
} from '../../data/ContentData'
import { RootState } from '../../redux/store/store'
import { ICamera } from '../../types'
import { selectID } from '../../redux/selectors/useSelectors'

//@CAMERA-CONTROLS FUNCTION

const Camera = ({
  pos = new THREE.Vector3(),
  look = new THREE.Vector3()
}: ICamera) => {
  const { camera, mouse, gl } = useThree()
  const cameraStartPosition = useSelector(
    (state: RootState) => state.lockedCameraStartPos_reducer
  )
  const focus = useSelector((state: RootState) => state.focus_reducer)
  const currentPulsarData = useSelector(
    (state: RootState) => state.currentPulsar_reducer
  )
  const id = useSelector(selectID)

  //@function to control distance between room trigger and camera, also camera angle in the return (number)
  const conditionalFocusZaxis = (focusZaxis: number): number => {
    if (currentPulsarData.cameraSide === 'frontSide')
      return focusZaxis + distanceFromCameraToObject
    if (
      currentPulsarData.cameraSide === 'frontLeft' ||
      currentPulsarData.cameraSide === 'backLeft'
    )
      return focusZaxis
    if (currentPulsarData.cameraSide === 'frontRight') return focusZaxis
    if (currentPulsarData.cameraSide === 'backSide')
      return focusZaxis - distanceFromCameraToObject
    if (currentPulsarData.cameraSide === 'frontCenter')
      return focusZaxis + distanceFromCameraToObject
  }

  //@function to control camera direction on subTriggers, also camera angle in the return (number)

  const conditionalFocusXaxis = (focusXaxis: number): number => {
    if (currentPulsarData.cameraSide === 'frontRight')
      return focusXaxis - distanceFromCameraToObject
    if (currentPulsarData.cameraSide === 'backLeft')
      return focusXaxis - distanceFromCameraToObject
    if (currentPulsarData.cameraSide === 'frontLeft')
      return focusXaxis + distanceFromCameraToObject
    if (currentPulsarData.cameraSide === 'frontSide') return focusXaxis + 1
    if (currentPulsarData.cameraSide === 'backSide') return focusXaxis
    if (currentPulsarData.cameraSide === 'frontCenter') return focusXaxis
  }

  let vector = new THREE.Vector3(
    cameraStartPosition.x,
    cameraStartPosition.y,
    cameraStartPosition.z
  )

  const zoom = useSelector((state: RootState) => state.zoom_reducer.status)
  const { cameraType } = useSelector((state: RootState) => state.camera_reducer)

  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [])

  //@DISABLING UNNECESSARY BUTTONS AND COMMANDS

  controls.mouseButtons.wheel = CameraControls.ACTION.NONE
  controls.mouseButtons.middle = CameraControls.ACTION.NONE
  controls.mouseButtons.right = CameraControls.ACTION.NONE

  //@INITIAL SETTINGS FOR CAMERA

  controls.camera.position.set(
    lockedCamera_startPosition[0],
    lockedCamera_startPosition[1],
    lockedCamera_startPosition[2]
  )
  controls.minPolarAngle = 0.7
  controls.maxPolarAngle = Math.PI / 2

  //VARIABLES for combining cameras

  let enableOrbit = true
  let witness = true

  //@MAIN ANIMATION HOOK

  return useFrame((state, delta) => {
    if (cameraType === 'locked') {
      enableOrbit = false
      witness = true
      zoom
        ? pos.set(
            conditionalFocusXaxis(focus.x),
            focus.y,
            conditionalFocusZaxis(focus.z)
          )
        : pos.set(
            cameraStartPosition.x,
            cameraStartPosition.y,
            cameraStartPosition.z
          )

      //changing camera Look at property on click (lookAt)
      zoom
        ? look.set(focus.x, focus.y, focus.z)
        : look.set(
            cameraStartPosition.x,
            cameraStartPosition.y,
            cameraStartPosition.z - 10
          )

      //set alpha for camera movement speed
      state.camera.position.lerp(pos, 1)

      //Camera moving on mouse move. For its amplitude change numbers below x and y

      if (!isMobile && Number.isInteger(id)) {
        camera.position.lerp(
          vector.set(mouse.x * 1.2, mouse.y * 1.2, camera.position.z),
          0.01
        )
        state.camera.updateProjectionMatrix()
      }

      controls.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        look.x,
        look.y,
        look.z,
        true
      )
    }

    if (cameraType === 'free' && witness) {
      // controls.setTarget(0, 4, 0)
      pos.set(
        cameraStartPosition.x,
        cameraStartPosition.y,
        cameraStartPosition.z
      )
      look.set(focus.x, focus.y, focus.z)
      state.camera.position.set(pos.x, pos.y, pos.z)

      controls.setLookAt(
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z,
        look.x,
        look.y,
        look.z,
        false
      )

      enableOrbit = true
    }

    if (cameraType === 'free') {
      witness = false
      controls.setTarget(
        lockedCamera_targetPosition[0],
        lockedCamera_targetPosition[1],
        lockedCamera_targetPosition[2]
      )

      // auto rotation of the main model

      controls.azimuthAngle += 0.05 * delta
      controls.azimuthRotateSpeed = 1
    }

    return controls.update(delta)
  })
}

export default Camera
