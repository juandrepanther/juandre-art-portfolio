import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentDataType } from '../../types'
import type { RootState } from '../store/store'

type ICurrentPulsarType = ContentDataType

const initialState: ContentDataType = {
  id: 0,
  labelTooltipTitle: '',
  type: '',
  position: [0, 0, 0],
  data: {
    parameters: {
      isPlaying: false,
      isMuted: true,
      videoProgress: 0,
      videoDuration: 0,
      isVideoThumbnail: '',
      isSlidesThumbnail: ''
    },
    content: [''],
    externalContent: {
      documentsUrls: [{ title: '', url: '' }],
      links: [{ title: '', link: '' }]
    },
    currentSlide: 0,
    currentVideo: 0
  },
  cameraSide: '',
  subTriggers: [
    {
      id: 0,
      type: 'none',
      position: [0, 0, 0],
      cameraSide: '',
      data: {
        parameters: {
          isPlaying: false,
          isMuted: true,
          videoProgress: 0,
          videoDuration: 0,
          isVideoThumbnail: '',
          isSlidesThumbnail: ''
        },
        content: [''],
        externalContent: {
          documentsUrls: [{ title: '', url: '' }],
          links: [{ title: '', link: '' }]
        },
        currentSlide: 0,
        currentVideo: 0
      },
      subLabelTooltipTitle: ''
    }
  ]
}

export const currentPulsarReducer = createSlice({
  name: 'currentPulsar_reducer',
  initialState,
  reducers: {
    setCurrentPulsar: (state, action: PayloadAction<ICurrentPulsarType>) => {
      const { id, type, position, data, cameraSide } = action.payload
      state.id = id
      state.type = type
      state.position = position
      state.data = data
      state.cameraSide = cameraSide
    },
    resetCurrentPulsar: (state) => {
      state.id = 0
    },
    changeIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.data.parameters.isPlaying = action.payload
    },
    setVideoCurrentTime: (state, action) => {
      // action.payload
      state.data.parameters.videoProgress = action.payload
    },
    setNextSlide: (state) => {
      state.data.currentSlide = state.data.currentSlide + 1
    },
    setExactSlide: (state, action: PayloadAction<number>) => {
      state.data.currentSlide = action.payload
    },
    setPreviousSlide: (state) => {
      state.data.currentSlide = state.data.currentSlide - 1
    },
    changeIsMuted: (state) => {
      state.data.parameters.isMuted = !state.data.parameters.isMuted
    },
    setNextVideo: (state) => {
      state.data.currentVideo = state.data.currentVideo + 1
    },
    setPreviousVideo: (state) => {
      state.data.currentVideo = state.data.currentVideo - 1
    },
    setExactVideo: (state, action: PayloadAction<number>) => {
      state.data.currentVideo = action.payload
    },
    setVideoDuration: (state, action: PayloadAction<number>) => {
      state.data.parameters.videoDuration = action.payload
    }
  }
})

export const {
  setCurrentPulsar,
  resetCurrentPulsar,
  changeIsPlaying,
  setVideoCurrentTime,
  setNextSlide,
  setPreviousSlide,
  changeIsMuted,
  setExactSlide,
  setNextVideo,
  setPreviousVideo,
  setExactVideo,
  setVideoDuration
} = currentPulsarReducer.actions
export const selectCurrentPulsar = (state: RootState) =>
  state.currentPulsar_reducer
export default currentPulsarReducer.reducer
