import React, { useRef } from 'react'
import { useHelper } from '@react-three/drei/core'
import { SpotLightHelper } from 'three'

function Maze_Lights() {
  const spotLightRef = useRef()
  useHelper(spotLightRef, SpotLightHelper, '#fff')
  return (
    <>
      <ambientLight intensity={10} color="#262626" />
    </>
  )
}

export default Maze_Lights
