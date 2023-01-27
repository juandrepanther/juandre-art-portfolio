import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

type ILogoTopIcons = {
  isLogoTopIconsVisible: boolean
}

//@LISTENER FOR OPENER is in Tower_Model.tsx file

const initialState: ILogoTopIcons = {
  isLogoTopIconsVisible: true
}

export const logoTopIconsReducer = createSlice({
  name: 'logoTopIconsVisible_Reducer',
  initialState,
  reducers: {
    changeLogoTopIconsVisibility: (state, action: PayloadAction<boolean>) => {
      state.isLogoTopIconsVisible = action.payload
    }
  }
})

export const { changeLogoTopIconsVisibility } = logoTopIconsReducer.actions
export const selectLogoTopIconsVisibility = (state: RootState) =>
  state.logoTopIconsVisible_Reducer
export default logoTopIconsReducer.reducer
