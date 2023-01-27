import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

type IDarkModeType = {
  isDarkMode: boolean
}

//CAMERA TYPE BY DEFAULT
const initialState: IDarkModeType = {
  isDarkMode: false
}

export const darkModeReducer = createSlice({
  name: 'darkMode_reducer',
  initialState,
  reducers: {
    setDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    }
  }
})

export const { setDarkMode } = darkModeReducer.actions
export const selectDarkMode = (state: RootState) => state.darkMode_reducer
export default darkModeReducer.reducer
