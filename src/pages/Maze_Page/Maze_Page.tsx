import { Canvas } from '@react-three/fiber'
import React from 'react'
import * as THREE from 'three'
import Maze_Model from './Maze_Model'
import { CameraShake, OrbitControls } from '@react-three/drei/core'
import Maze_Lights from './Maze_Lights'

import { Physics, Debug } from '@react-three/rapier'
import Player from './Player'
import Maze_Effects from './Maze_Effects'
import Maze_Title from './Maze_Title'
import Stats from '../Scene_Page/Stats'

const camera_shake_config = {
  maxYaw: 0.01, // Max amount camera can yaw in either direction
  maxPitch: 0.01, // Max amount camera can pitch in either direction
  maxRoll: 0.05, // Max amount camera can roll in either direction
  yawFrequency: 0.1, // Frequency of the the yaw rotation
  pitchFrequency: 0.1, // Frequency of the pitch rotation
  rollFrequency: 0.1, // Frequency of the roll rotation
  intensity: 1, // initial intensity of the shake
  decay: false, // should the intensity decay over time
  decayRate: 0.65, // if decay = true this is the rate at which intensity will reduce at
  controls: undefined // if using orbit controls, pass a ref here so we can update the rotation
}

function Maze_Page() {
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
        far: 3, // 3 for game, more - for the dev
        fov: 75
      }}
      style={{
        width: '100%',
        backgroundColor: 'black',
        position: 'fixed'
      }}
      //@ if you want to all properties (also RENDERER), access like below
      onCreated={(canvas) => {
        canvas.gl.setClearColor('#000', 1)
      }}
      shadows
    >
      {/* <OrbitControls /> */}
      <fog attach="fog" args={['black', 0, 3]} />
      <Maze_Lights />
      {/* <Maze_Effects /> */}
      <Maze_Title />
      {/* <Stats /> */}
      <Physics>
        {/* <Debug /> */}
        <Maze_Model />
        <Player />
      </Physics>
    </Canvas>
  )
}

export default Maze_Page
