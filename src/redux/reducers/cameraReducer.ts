import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

type ICameraReducer = {
  cameraType: 'free' | 'locked'
}

//CAMERA TYPE BY DEFAULT
const initialState = {
  cameraType: 'free'
}

export const cameraReducer = createSlice({
  name: 'camera_reducer',
  initialState,
  reducers: {
    setCamera: (state, action: PayloadAction<ICameraReducer>) => {
      state.cameraType = action.payload.cameraType
    }
  }
})

export const { setCamera } = cameraReducer.actions
export const selectCamera = (state: RootState) => state.camera_reducer
export default cameraReducer.reducer
