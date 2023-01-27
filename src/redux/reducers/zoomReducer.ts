import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

const initialState = {
  status: false
}

export const zoomReducer = createSlice({
  name: 'zoom_reducer',
  initialState,
  reducers: {
    setZoom: (state, action: PayloadAction<boolean>) => {
      state.status =
        typeof action.payload === 'boolean' ? action.payload : !state.status
    }
  }
})

export const { setZoom } = zoomReducer.actions
export const selectZoom = (state: RootState) => state.zoom_reducer
export default zoomReducer.reducer
