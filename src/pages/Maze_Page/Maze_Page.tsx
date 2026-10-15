import { Box, Typography } from '@mui/material'
import { useEffect } from 'react'
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
import MazeStats from './maze-stats'
import { useMazeStore } from '../../lib/zustand/maze-store'

const isDebugModeEnabled = false

function Maze_Page() {
  const { closeMobileHint, isMobileHintClosed } = useMazeStore()
  const controlsLabel = isMobile
    ? 'Swipe to move through the maze. Double-tap to reset your position.'
    : 'Use W, A, S, D or the arrow keys to move. Press R to reset the game.'

  useEffect(() => {
    if (!isMobile || isMobileHintClosed) {
      return
    }

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
    ).then(() => {
      closeMobileHint()
    })
  }, [closeMobileHint, isMobileHintClosed])

  return (
    <>
      <Box
        aria-label="Maze controls"
        role="note"
        sx={{
          position: 'fixed',
          left: 16,
          bottom: 16,
          zIndex: 20,
          maxWidth: { xs: 'calc(100% - 32px)', sm: 420 },
          px: 2,
          py: 1.5,
          borderRadius: 3,
          border: '1px solid rgba(220, 229, 236, 0.16)',
          backgroundColor: 'rgba(12, 17, 23, 0.76)',
          backdropFilter: 'blur(18px)',
          pointerEvents: 'none'
        }}
      >
        <Typography
          sx={{ color: 'secondary.main', fontSize: '0.8rem', mb: 0.5 }}
        >
          Maze controls
        </Typography>
        <Typography sx={{ color: 'common.white', lineHeight: 1.6 }}>
          {controlsLabel}
        </Typography>
      </Box>
      <Leva hidden={isDebugModeEnabled && isLevel_2 ? false : true} />
      <Canvas
        performance={{ current: 1, min: 0.1, max: 1, debounce: 200 }}
        dpr={[1.5, 3]}
        gl={{
          antialias: true,
          physicallyCorrectLights: true,
          toneMapping: THREE.ReinhardToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
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
              <MazeStats />
              <Debug />
            </>
          )}
          <Maze_Model />
          {((!isMobile && !isDebugModeEnabled) ||
            (isMobile && isMobileHintClosed)) && <Player />}
        </Physics>
      </Canvas>
    </>
  )
}

export default Maze_Page
