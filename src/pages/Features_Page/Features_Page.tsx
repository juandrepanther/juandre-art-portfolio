import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'
import { Environment, OrbitControls } from '@react-three/drei/core'
import Stats from '../Scene_Page/Stats'
import { cameraTargetsTypes } from '../../types'

import Object_1 from './Objects/Object_1/Object_1'
import Object_2 from './Objects/Object_2/Object_2'
import Object_3 from './Objects/Object_3/Object_3'
import { buttonGroup, useControls } from 'leva'

const hdrImg = '/images/hdrImg.hdr'

function Features_Page() {
  const cameraTargets = [
    new THREE.Vector3(0, 0, 20),
    new THREE.Vector3(-20, 0, 17),
    new THREE.Vector3(15, 0, 3)
  ]

  const [objectValue, set] = useControls(() => ({
    ObjectNumber: 0,
    ' ': buttonGroup({
      '1': () => set({ ObjectNumber: 0 }),
      '2': () => set({ ObjectNumber: 1 }),
      '3': () => set({ ObjectNumber: 2 })
    })
  }))
  console.log(objectValue.ObjectNumber)
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
      <OrbitControls
        target={cameraTargets[objectValue.ObjectNumber]} // <-- Vec3
        enableDamping={false}
        enablePan={false}
        enableZoom={false}
      />
      <Environment files={hdrImg} background />
      <Object_1 object_1={cameraTargets[0]} />
      <Object_2 object_2={cameraTargets[1]} />
      <Object_3 object_3={cameraTargets[2]} />
      <Stats />
    </Canvas>
  )
}

export default Features_Page
