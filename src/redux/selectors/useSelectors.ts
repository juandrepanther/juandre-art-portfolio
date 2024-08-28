import { RootState } from '../store/store'

/*
By default memoized useSelector returns undefined.
When it receives state, it will re-render the Component,
from which it was called.
*/

export const selectID = (state: RootState) => state.currentPulsar_reducer.id

export const selectIsInitialPopupVisible = (state: RootState) =>
  state.initialPopup_Reducer.isInitialPopupVisible

export const selectIsLogoTopIconsVisible = (state: RootState) =>
  state.logoTopIconsVisible_Reducer.isLogoTopIconsVisible

export const selectCameraType = (state: RootState) =>
  state.camera_reducer.cameraType

export const selectCameraStartPosition = (state: RootState) =>
  state.lockedCameraStartPos_reducer

export const selectDarkMode = (state: RootState) =>
  state.darkMode_reducer.isDarkMode

export const selectSideBar_status = (state: RootState) =>
  state.sideBar_reducer.sideBar_status
