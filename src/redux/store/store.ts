import { configureStore } from '@reduxjs/toolkit'
import cameraReducer from '../reducers/cameraReducer'
import currentPulsarReducer from '../reducers/currentPulsarReducer'
import darkModeReducer from '../reducers/darkModeReducer'
import debuggerReducer from '../reducers/debuggerReducer'
import focusReducer from '../reducers/focusReducer'
import initialPopupReducer from '../reducers/initialPopupReducer'
import lockedCameraStartPos from '../reducers/lockedCameraStartPos'
import logoTopIconsReducer from '../reducers/logoTopIconsReducer'
import sideBarReducer from '../reducers/sideBarReducer'
import zoomReducer from '../reducers/zoomReducer'
import alertReducer from '../reducers/alertReducer'

export const store = configureStore({
  reducer: {
    zoom_reducer: zoomReducer,
    focus_reducer: focusReducer,
    sideBar_reducer: sideBarReducer,
    camera_reducer: cameraReducer,
    lockedCameraStartPos_reducer: lockedCameraStartPos,
    currentPulsar_reducer: currentPulsarReducer,
    initialPopup_Reducer: initialPopupReducer,
    debugger_reducer: debuggerReducer,
    logoTopIconsVisible_Reducer: logoTopIconsReducer,
    darkMode_reducer: darkModeReducer,
    alert_reducer: alertReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
