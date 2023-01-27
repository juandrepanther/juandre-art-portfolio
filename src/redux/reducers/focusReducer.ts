import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

type FocusTypes = {
  x: number
  y: number
  z: number
}

let initialState = {
  x: 0,
  y: 0,
  z: 0
}

export const focusReducer = createSlice({
  name: 'focus_reducer',
  initialState,
  reducers: {
    setFocus: (state, action: PayloadAction<FocusTypes>) => {
      ;(state.x = action.payload.x), (state.y = action.payload.y)
      state.z = action.payload.z
    },
    resetFocus: (state) => {
      state.x = 0
      state.y = 0
      state.z = 0
    }
  }
})

export const { setFocus, resetFocus } = focusReducer.actions
export const selectZoom = (state: RootState) => state.focus_reducer
export default focusReducer.reducer
