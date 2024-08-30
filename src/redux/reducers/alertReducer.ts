import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Props {
  isClosed: boolean
}

const initialState: Props = {
  isClosed: false
}

export const alertReducer = createSlice({
  name: 'alert_reducer',
  initialState,
  reducers: {
    setAlertState: (state, action: PayloadAction<boolean>) => {
      state.isClosed = action.payload
    }
  }
})

export const { setAlertState } = alertReducer.actions

export default alertReducer.reducer
