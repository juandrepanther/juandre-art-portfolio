import React from 'react'
import swal from '@sweetalert/with-react'
import { isMobile } from 'react-device-detect'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Maze_Model, { isLevel_2 } from './Maze_Model'
import Maze_Lights from './Maze_Lights'
import { OrbitControls } from '@react-three/drei/core'
import { Physics, Debug } from '@react-three/rapier'
import { Leva } from 'leva'
import Player from './Player'
import Maze_Title from './Maze_Title'
import Stats from '../Scene_Page/Stats'
import { RootState } from '../../redux/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setAlertState } from '../../redux/reducers/alertReducer'

const isDebugModeEnabled = false

function Maze_Page() {
  const { isClosed } = useSelector((state: RootState) => state.alert_reducer)
  const dispatch = useDispatch()

  isMobile &&
    !isClosed &&
    swal(
      <div>
        <b style={{ fontSize: '1.5rem' }}>Mobile Navigation</b>

        <ul style={{ marginTop: '1rem' }}>
          <li style={{ listStyleType: 'none' }}>Use Finger Swipes to Move</li>
          <li style={{ listStyleType: 'none' }}>Use Double-Touch to Reset</li>
        </ul>

        <h4 style={{ marginTop: '1rem' }}>Find the Exit!</h4>
      </div>,
      {
        icon: 'info',
        closeOnClickOutside: false,
        button: 'Let`s Go!'
      }
    ).then((status) => {
      dispatch(setAlertState(status))
    })

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
          {((!isMobile && !isDebugModeEnabled) || (isMobile && isClosed)) && (
            <Player />
          )}
        </Physics>
      </Canvas>
    </>
  )
}

export default Maze_Page
