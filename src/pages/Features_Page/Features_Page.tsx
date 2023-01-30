import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'
import { Environment, OrbitControls, Sky } from '@react-three/drei/core'
import Stats from '../Scene_Page/Stats'
import Object_1 from './Objects/Object_1/Object_1'
import { Leva } from 'leva'
import { Html } from '@react-three/drei'
import Object_2 from './Objects/Object_2/Object_2'
import Object_3 from './Objects/Object_3/Object_3'
const hdrImg = '/images/hdrImg.hdr'

function Features_Page() {
  return (
    <Canvas
      performance={{ current: 1, min: 0.1, max: 1, debounce: 200 }}
      dpr={[1.5, 3]}
      gl={{
        antialias: true,
        physicallyCorrectLights: true,
        toneMapping: THREE.ReinhardToneMapping,
        outputEncoding: THREE.sRGBEncoding,
        powerPreference: 'high-performance'
      }}
      camera={{
        near: 0.1,
        far: 60, // 3 for game, more - for the dev
        fov: 75,
        position: new THREE.Vector3(0, 0, -10)
      }}
      style={{
        width: '100%',
        // backgroundColor: 'grey',
        position: 'fixed'
      }}
      //@ if you want to all properties (also RENDERER), access like below
      // onCreated={(canvas) => {
      //   canvas.gl.setClearColor('grey', 1)
      // }}
    >
      <OrbitControls />
      <Environment files={hdrImg} background />
      <Object_1 />
      <Object_2 />
      <Object_3 />
      <Stats />
    </Canvas>
  )
}

export default Features_Page
