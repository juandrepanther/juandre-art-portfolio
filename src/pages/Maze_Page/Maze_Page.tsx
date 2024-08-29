import React from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Maze_Model, { isLevel_2 } from './Maze_Model'
import { OrbitControls } from '@react-three/drei/core'
import Maze_Lights from './Maze_Lights'
import { Physics, Debug } from '@react-three/rapier'
import Player from './Player'
import Maze_Title from './Maze_Title'
import Stats from '../Scene_Page/Stats'
import { Leva } from 'leva'

const isDebugModeEnabled = false

function Maze_Page() {
  return (
    <>
      <Leva hidden={isDebugModeEnabled && isLevel_2 ? false : true} />
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
          far: isDebugModeEnabled ? 100 : 3,
          fov: 75
        }}
        style={{
          width: '100%',
          backgroundColor: 'black',
          position: 'fixed'
        }}
        onCreated={(canvas) => {
          canvas.gl.setClearColor('#000', 1)
        }}
        shadows
      >
        {!isDebugModeEnabled && (
          <>
            <fog attach="fog" args={['black', 0, 3]} />
            <Maze_Title />
          </>
        )}

        <Maze_Lights />
        <Physics>
          {isDebugModeEnabled && (
            <>
              <OrbitControls />
              <Stats />
              <Debug />
            </>
          )}
          <Maze_Model />
          {!isDebugModeEnabled && <Player />}

          {/* <Player /> */}
        </Physics>
      </Canvas>
    </>
  )
}

export default Maze_Page
