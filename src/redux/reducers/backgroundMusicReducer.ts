import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

type IBackgroundMusicReducer = {
  isInitialPopupVisible: boolean
}

//@LISTENNER FOR OPENER is in Tower_Model.tsx file

const initialState = {
  isPlayingBackgroundMusic: false
}

export const backgroundMusicReducer = createSlice({
  name: 'backgroundMusic_Reducer',
  initialState,
  reducers: {
    changeIsPlayingBackgroundMusic: (state, action: PayloadAction<boolean>) => {
      state.isPlayingBackgroundMusic = action.payload
    }
  }
})

export const { changeIsPlayingBackgroundMusic } = backgroundMusicReducer.actions
export const selectBackgroundMusic_Reducer = (state: RootState) =>
  state.backgroundMusic_Reducer
export default backgroundMusicReducer.reducer
