import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

type IInitialPopupReducer = {
  isInitialPopupVisible: boolean
}

//@LISTENER FOR OPENER is in Tower_Model.tsx file

const initialState = {
  isInitialPopupVisible: true
}

export const initialPopupReducer = createSlice({
  name: 'initialPopup_Reducer',
  initialState,
  reducers: {
    changeInitialPopupVisibility: (state, action: PayloadAction<boolean>) => {
      state.isInitialPopupVisible = action.payload
    }
  }
})

export const { changeInitialPopupVisibility } = initialPopupReducer.actions
export const selectIsInitialPopupVisible = (state: RootState) =>
  state.initialPopup_Reducer
export default initialPopupReducer.reducer
