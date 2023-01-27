import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

const initialState = {
  sideBar_status: false
}

export const sideBarReducer = createSlice({
  name: 'sideBar_reducer',
  initialState,
  reducers: {
    setSideBar_status: (state, action: PayloadAction<boolean>) => {
      state.sideBar_status =
        typeof action.payload === 'boolean'
          ? action.payload
          : !state.sideBar_status
    }
  }
})

export const { setSideBar_status } = sideBarReducer.actions
export const selectStatus = (state: RootState) => state.sideBar_reducer
export default sideBarReducer.reducer
