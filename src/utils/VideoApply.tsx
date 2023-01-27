import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeIsPlaying } from '../redux/reducers/currentPulsarReducer'
import { linksType } from '../types'
import {
  selectCurrentVideo,
  selectID,
  selectIsPlaying,
  selectVideoProgress
} from '../redux/selectors/useSelectors'

//@videoUrls can be string[] for just single video OR array with multiple video objects

function VideoApply(videoUrls: string[] | linksType[], roomSubLabelID: number) {
  const dispatch = useDispatch()

  const isVideoPlaying = useSelector(selectIsPlaying)
  const VideoProgress = useSelector(selectVideoProgress)
  const CurrentVideo = useSelector(selectCurrentVideo)

  //@Conditional re-render for useSelector redux hook using equality callback function
  let isSubLabelCLicked = false

  const id = useSelector(selectID, (item, initialItem) => {
    //if id number has a decimal, then re-render only
    if (!Number.isInteger(item)) {
      isSubLabelCLicked = true
      return false
    }
    if (isSubLabelCLicked) {
      isSubLabelCLicked = false
      return false
    } else {
      return true
    }
  })

  const audioPlayer = document.querySelector('audio')

  const [video] = useState(() => {
    const vid = document.createElement('video')
    vid.autoplay = false
    vid.playsInline = true
    vid.setAttribute('class', 'video')
    vid.src =
      videoUrls.length === 1
        ? videoUrls[0].toString()
        : videoUrls[0].link.toString()
    vid.crossOrigin = 'Anonymous'
    vid.style.transform = 'rotate(45deg)'
    return vid
  })

  useEffect(() => {
    if (roomSubLabelID === id) {
      const button = document.querySelector('.play-pause-btn')
      //@linking magic between 3D video and 2D Nav Panel happens here

      //! infinity number? Need to solve. Replicate: click on Back to RoomView, check states
      video.currentTime = VideoProgress

      // @HERE Data TRANSFER to REDUX for TIME_LINE PURPOSES
      //@ and using user gesture play and pause video

      if (isVideoPlaying === false) {
        button &&
          button.addEventListener(
            'click',
            () => {
              //@Multiple-Video Support: re-applying the currentVideo Index

              video.src =
                videoUrls.length === 1
                  ? videoUrls[0].toString()
                  : videoUrls[CurrentVideo].link.toString()
              const playPromise = video.play()

              if (playPromise !== undefined) {
                //@backgroundMusic PAUSED HERE When video is playing

                // audioPlayer.pause()

                playPromise.catch((error) => {
                  console.log(
                    `This Google Chrome error does not affect functionality: ${error}`
                  )
                })
              }
              dispatch(changeIsPlaying(true))
            },
            { passive: true }
          )
      } else {
        button.addEventListener(
          'click',
          () => {
            // audioPlayer.play()
            video.pause()
            dispatch(changeIsPlaying(false))
          },
          { passive: true }
        )
      }
    } else {
      video.pause()
    }
  }, [isVideoPlaying, VideoProgress, CurrentVideo, id])

  return video
}

export default VideoApply
