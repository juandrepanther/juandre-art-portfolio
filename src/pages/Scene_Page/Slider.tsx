import { useLoader } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { useSelector } from 'react-redux'
import { modelScale, TV_Scale } from '../../data/ContentData'
import cameraSideApply from '../../utils/cameraSideApply'
import { ISlide } from '../../types'
import {
  selectCurrentSlide,
  selectDataContent,
  selectID,
  selectSlidesThumbnail
} from '../../redux/selectors/useSelectors'

const loader = new THREE.TextureLoader()

function Slider({
  position,
  slidesUrls,
  isThumbnailRequired,
  subLabelID,
  cameraSide
}: ISlide) {
  //@Conditional re-render for useSelector redux hook using equality callback function
  let isSubLabelCLicked = false

  const id = useSelector(selectID, (item, initialItem) => {
    console.log(item, initialItem)
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

  const isSlidesThumbnail = useSelector(selectSlidesThumbnail)
  const getDataContent = useSelector(selectDataContent)
  const getCurrentSlide = useSelector(selectCurrentSlide)

  console.log('Slider re-render', subLabelID)

  const thumbnailRef = useRef<THREE.Mesh>(null!)

  let slidesThumbnailTexture: any

  useEffect(() => {
    if (thumbnailRef.current) {
      if (isSlidesThumbnail) thumbnailRef.current.visible = false
      if (isSlidesThumbnail === undefined) thumbnailRef.current.visible = true
    }
  }, [isSlidesThumbnail])

  //@rendering will be depending on isThumbnailVideo existence or not

  if (isThumbnailRequired) {
    const videoThumbnail = loader.load(isThumbnailRequired)
    slidesThumbnailTexture = videoThumbnail
  }

  //@depending on cameraSide property will be adjusted corrections in position and rotation

  const modifiedData = cameraSideApply(position, cameraSide)

  if (subLabelID === id && getDataContent.length) {
    const slidesTexture = useLoader(TextureLoader, slidesUrls)

    console.log(subLabelID === id && getDataContent.length)

    return (
      <>
        {console.log('Bug re-render Solver')}
        <mesh
          // visible={true}
          position={[
            modifiedData[0][0],
            modifiedData[0][1],
            modifiedData[0][2]
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
            map={slidesTexture[getCurrentSlide]}
            toneMapped={false}
            side={2}
          ></meshBasicMaterial>
        </mesh>
      </>
    )
  } else {
    return (
      <mesh
        visible={isThumbnailRequired ? true : false}
        ref={thumbnailRef}
        position={[modifiedData[0][0], modifiedData[0][1], modifiedData[0][2]]}
        scale={modelScale}
        rotation={[modifiedData[1][0], modifiedData[1][1], modifiedData[1][2]]}
      >
        <planeGeometry args={[TV_Scale.width, TV_Scale.height]} />
        <meshBasicMaterial
          visible={isThumbnailRequired ? true : false}
          map={slidesThumbnailTexture}
          toneMapped={false}
          side={2}
        ></meshBasicMaterial>
      </mesh>
    )
  }
}

export default Slider
