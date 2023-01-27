import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import * as THREE from 'three'
import { modelScale, TV_Scale } from '../../data/ContentData'
import { IVideoPlayer } from '../../types'
import cameraSideApply from '../../utils/cameraSideApply'
import { selectIsPlaying } from '../../redux/selectors/useSelectors'
import VideoApply from '../../utils/VideoApply'
const loader = new THREE.TextureLoader()

function VideoPlayer({
  position,
  videoUrls,
  isThumbnailRequired,
  subLabelID,
  cameraSide
}: IVideoPlayer) {
  console.log('Video PLayer render')
  // const { data } = useSelector(
  //   (state: RootState) => state.currentPulsar_reducer
  // )
  const isVideoPlaying = useSelector(selectIsPlaying)

  const thumbnailRef = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    if (thumbnailRef.current) {
      if (isVideoPlaying) {
        thumbnailRef.current.visible = false
      }
      if (isVideoPlaying === undefined) {
        thumbnailRef.current.visible = true
      }
    }
  }, [isVideoPlaying])

  let videoThumbnailTexture: any

  //@rendering will be depending on isThumbnailVideo existence or not

  if (isThumbnailRequired) {
    const videoThumbnail = loader.load(isThumbnailRequired)
    videoThumbnailTexture = videoThumbnail
  }

  //@depending on cameraSide property will be adjusted corrections in position and rotation

  const modifiedData = cameraSideApply(position, cameraSide)

  //@RENDER

  return (
    <>
      {isThumbnailRequired && (
        <mesh
          ref={thumbnailRef}
          position={[
            modifiedData[0][0],
            modifiedData[0][1],
            modifiedData[0][2] + 0.001
          ]}
          scale={modelScale}
          rotation={[
            modifiedData[1][0],
            modifiedData[1][1],
            modifiedData[1][2]
          ]}
        >
          <planeGeometry args={[TV_Scale.width, TV_Scale.height]} />
          <meshBasicMaterial
            map={videoThumbnailTexture}
            toneMapped={false}
            side={2}
          ></meshBasicMaterial>
        </mesh>
      )}

      <mesh
        position={[modifiedData[0][0], modifiedData[0][1], modifiedData[0][2]]}
        scale={modelScale}
        rotation={[modifiedData[1][0], modifiedData[1][1], modifiedData[1][2]]}
      >
        <planeGeometry args={[TV_Scale.width, TV_Scale.height]} />
        <meshBasicMaterial toneMapped={false} side={2}>
          <videoTexture
            attach="map"
            args={[VideoApply(videoUrls, subLabelID)]}
            encoding={THREE.sRGBEncoding}
          />
        </meshBasicMaterial>
      </mesh>
    </>
  )
}

export default VideoPlayer
