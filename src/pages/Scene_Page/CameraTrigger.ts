import React from 'react'
import { setCamera } from '../../redux/reducers/cameraReducer'
import { setCurrentPulsar } from '../../redux/reducers/currentPulsarReducer'
import { setFocus } from '../../redux/reducers/focusReducer'
import { setLockedCameraStartPos } from '../../redux/reducers/lockedCameraStartPos'
import { setSideBar_status } from '../../redux/reducers/sideBarReducer'
import { setZoom } from '../../redux/reducers/zoomReducer'

//selectedData must be the pure object and not array with an object inside

const CameraTrigger = (selectedData: any, dispatch: any) => {
  dispatch(setCurrentPulsar(selectedData as any))

  dispatch(
    setLockedCameraStartPos({
      x: selectedData.position[0],
      y: selectedData.position[1],
      z: selectedData.position[2]
    })
  )
  dispatch(
    setFocus({
      x: selectedData.position[0],
      y: selectedData.position[1],
      z: selectedData.position[2]
    })
  ),
    dispatch(setSideBar_status(false))
  dispatch(setCamera({ cameraType: 'locked' }))
  dispatch(setZoom(true))
}

export default CameraTrigger
