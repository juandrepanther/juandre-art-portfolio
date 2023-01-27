import { RootState } from '../store/store'

/*
By default memoized useSelector returns undefined.
When it receives state, it will re-render the Component,
from which it was called.
*/
export const selectIsPlaying = (state: RootState) =>
  state.currentPulsar_reducer.data?.parameters?.isPlaying

export const selectParentDataType = (state: RootState) =>
  state.currentPulsar_reducer.type

export const selectCurrentVideo = (state: RootState) =>
  state.currentPulsar_reducer.data?.currentVideo

export const selectVideoProgress = (state: RootState) =>
  state.currentPulsar_reducer.data?.parameters?.videoProgress

export const selectID = (state: RootState) => state.currentPulsar_reducer.id

export const selectSlidesThumbnail = (state: RootState) =>
  state.currentPulsar_reducer.data?.parameters?.isSlidesThumbnail

export const selectDataContent = (state: RootState) =>
  state.currentPulsar_reducer.data?.content

export const selectDataExternalContent = (state: RootState) =>
  state.currentPulsar_reducer.data?.externalContent

export const selectCurrentSlide = (state: RootState) =>
  state.currentPulsar_reducer.data?.currentSlide

export const selectIsPlayingBackgroundMusic = (state: RootState) =>
  state.backgroundMusic_Reducer.isPlayingBackgroundMusic

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

//isWireframe Selectors

export const selectIsWireframeRooms = (state: RootState) =>
  state.debugger_reducer.isWireframeRooms

export const selectIsWireframeBuilding = (state: RootState) =>
  state.debugger_reducer.isWireframeBuilding

export const selectIsWireframeIntersection = (state: RootState) =>
  state.debugger_reducer.isWireframeIntersection

export const selectIsWireframeVoid = (state: RootState) =>
  state.debugger_reducer.isWireframeVoid

export const selectIsWireframeCharacters = (state: RootState) =>
  state.debugger_reducer.isWireframeCharacters

export const selectIsMonitoring_status = (state: RootState) =>
  state.debugger_reducer.isMonitoring

//sideBar Selectors

export const selectSideBar_status = (state: RootState) =>
  state.sideBar_reducer.sideBar_status
