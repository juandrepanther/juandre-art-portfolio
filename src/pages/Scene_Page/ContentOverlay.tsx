import React from 'react'
import ContentData from '../../data/ContentData'
import Slider from './Slider'
import VideoPlayer from './VideoPlayer'

//EXTRACTING VIDEO & SLIDES DATA and removing empty arrays

const allVideoSubLabelsData =
  ContentData &&
  ContentData.map((parent) =>
    parent.subTriggers?.filter((subLabel) => subLabel.type === 'video')
  ).filter((items) => items !== undefined && items.length === 1)

const allSlidesSubLabelsData =
  ContentData &&
  ContentData.map((parent) =>
    parent.subTriggers?.filter((subLabel) => subLabel.type === 'slides')
  ).filter((items) => items !== undefined && items.length === 1)

function ContentOverlay() {
  //@DYNAMIC VIDEOS AND SLIDES RENDER
  return (
    <>
      {allVideoSubLabelsData &&
        allVideoSubLabelsData.map((videoSubLabels) => {
          return videoSubLabels.map((videoSubLabel) => {
            return (
              <VideoPlayer
                key={videoSubLabel.id}
                position={videoSubLabel.position}
                videoUrls={videoSubLabel.data.content}
                subLabelID={videoSubLabel.id}
                cameraSide={videoSubLabel.cameraSide}
                isThumbnailRequired={
                  videoSubLabel?.data?.parameters?.isVideoThumbnail
                }
              />
            )
          })
        })}
      {allSlidesSubLabelsData &&
        allSlidesSubLabelsData.map((slidesSubLabels) => {
          return slidesSubLabels.map((slidesSubLabel) => {
            return (
              <Slider
                key={slidesSubLabel.id}
                position={slidesSubLabel.position}
                slidesUrls={slidesSubLabel.data.content}
                subLabelID={slidesSubLabel.id}
                cameraSide={slidesSubLabel.cameraSide}
                isThumbnailRequired={
                  slidesSubLabel?.data?.parameters?.isSlidesThumbnail
                }
              />
            )
          })
        })}
    </>
  )
}

export default ContentOverlay
