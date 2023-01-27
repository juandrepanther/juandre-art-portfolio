import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { lockedCamera_startPosition } from '../../data/ContentData'
import type { RootState } from '../store/store'

type lockedCameraStartPosTypes = {
  x: number
  y: number
  z: number
}

//@locked Camera initial Position Here

let initialState = {
  x: lockedCamera_startPosition[0],
  y: lockedCamera_startPosition[1],
  z: lockedCamera_startPosition[2]
}

export const lockedCameraStartPos = createSlice({
  name: 'lockedCameraStartPos_reducer',
  initialState,
  reducers: {
    setLockedCameraStartPos: (
      state,
      action: PayloadAction<lockedCameraStartPosTypes>
    ) => {
      ;(state.x = action.payload.x), (state.y = action.payload.y)
      // z is a distance between object and locked camera
      state.z = action.payload.z + 1
    },
    resetLockedCameraStartPos: (state) => {
      state.x = initialState.x
      state.y = initialState.y
      state.z = initialState.z
    }
  }
})

export const { setLockedCameraStartPos, resetLockedCameraStartPos } =
  lockedCameraStartPos.actions
export const selectLockedCameraStartPos = (state: RootState) =>
  state.lockedCameraStartPos_reducer
export default lockedCameraStartPos.reducer
