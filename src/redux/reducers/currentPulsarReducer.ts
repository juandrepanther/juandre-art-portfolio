import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentDataType } from '../../types'
import type { RootState } from '../store/store'

type ICurrentPulsarType = ContentDataType

const initialState: ContentDataType = {
  id: 0,
  labelTooltipTitle: '',
  type: '',
  position: [0, 0, 0],
  cameraSide: ''
}

export const currentPulsarReducer = createSlice({
  name: 'currentPulsar_reducer',
  initialState,
  reducers: {
    setCurrentPulsar: (state, action: PayloadAction<ICurrentPulsarType>) => {
      const { id, type, position, cameraSide } = action.payload
      state.id = id
      state.type = type
      state.position = position
      state.cameraSide = cameraSide
    },
    resetCurrentPulsar: (state) => {
      state.id = 0
    }
  }
})

export const { setCurrentPulsar, resetCurrentPulsar } =
  currentPulsarReducer.actions
export const selectCurrentPulsar = (state: RootState) =>
  state.currentPulsar_reducer
export default currentPulsarReducer.reducer
