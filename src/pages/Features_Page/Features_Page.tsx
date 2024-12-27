import React from 'react'
import Stats from '../Scene_Page/Stats'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei/core'

import Object_1 from './Objects/Object_1/Object_1'
import Object_2 from './Objects/Object_2/Object_2'
import Object_3 from './Objects/Object_3/Object_3'

const hdrImg = '/images/hdrImg.hdr'

function Features_Page() {
  const cameraTargets = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 20),
    new THREE.Vector3(-20, 0, 17),
    new THREE.Vector3(15, 0, 3)
  ]

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
        far: 100, // 3 for game, more - for the dev
        fov: 75,
        position: new THREE.Vector3(0, 5, -20)
      }}
      style={{
        width: '100%',
        position: 'fixed'
      }}
      //@ if you want to all properties (also RENDERER), access like below
      // onCreated={(canvas) => {
      //   canvas.gl.setClearColor('grey', 1)
      // }}
    >
      <OrbitControls />
      <Environment files={hdrImg} background />
      <Object_1 object_1={cameraTargets[0]} />
      <Object_2 object_2={cameraTargets[1]} />
      <Object_3 object_3={cameraTargets[2]} />
      <Stats />
    </Canvas>
  )
}

export default Features_Page
