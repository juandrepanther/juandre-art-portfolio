import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store/store'

export type DebuggerPositionTypes = {
  x: number
  y: number
  z: number
  isWireframeRooms: boolean
  isWireframeBuilding: boolean
  isWireframeIntersection: boolean
  isWireframeVoid: boolean
  isWireframeCharacters: boolean
  helperBallrotate: boolean
  isMonitoring: boolean
}

let initialState: DebuggerPositionTypes = {
  x: -3.42,
  y: 3.66,
  z: 2,
  isWireframeRooms: false,
  isWireframeBuilding: false,
  isWireframeIntersection: false,
  isWireframeVoid: false,
  isWireframeCharacters: false,
  helperBallrotate: false,
  isMonitoring: false
}

export const debuggerReducer = createSlice({
  name: 'debugger_reducer',
  initialState,
  reducers: {
    setDebuggerStates: (
      state,
      action: PayloadAction<DebuggerPositionTypes>
    ) => {
      ;(state.x = action.payload.x), (state.y = action.payload.y)
      state.z = action.payload.z
      state.isWireframeRooms = action.payload.isWireframeRooms
      state.isWireframeBuilding = action.payload.isWireframeBuilding
      state.isWireframeIntersection = action.payload.isWireframeIntersection
      state.isWireframeVoid = action.payload.isWireframeVoid
      state.isWireframeCharacters = action.payload.isWireframeCharacters
      state.helperBallrotate = action.payload.helperBallrotate
      state.isMonitoring = action.payload.isMonitoring
    }
  }
})

export const { setDebuggerStates } = debuggerReducer.actions
export const selectZoom = (state: RootState) => state.debugger_reducer
export default debuggerReducer.reducer
