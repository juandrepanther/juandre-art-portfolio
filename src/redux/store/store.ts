import { configureStore } from '@reduxjs/toolkit'
import backgroundMusicReducer from '../reducers/backgroundMusicReducer'
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

export const store = configureStore({
  reducer: {
    zoom_reducer: zoomReducer,
    focus_reducer: focusReducer,
    sideBar_reducer: sideBarReducer,
    camera_reducer: cameraReducer,
    lockedCameraStartPos_reducer: lockedCameraStartPos,
    currentPulsar_reducer: currentPulsarReducer,
    initialPopup_Reducer: initialPopupReducer,
    backgroundMusic_Reducer: backgroundMusicReducer,
    debugger_reducer: debuggerReducer,
    logoTopIconsVisible_Reducer: logoTopIconsReducer,
    darkMode_reducer: darkModeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

//EXPORTS TYPES

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
