//@GENERAL IMPORTS
import { cameraDepthLimit, developerMode } from './data/ContentData'
import React, { lazy, Suspense } from 'react'
import CameraControls from 'camera-controls'
CameraControls.install({ THREE })

//@UTILS IMPORTS
import CameraSwitcher from './utils/CameraSwitcher'

//@IMPORT COMPONENTS

import AudioPlayer from './pages/Scene_Page/AudioPlayer'
import ContentOverlay from './pages/Scene_Page/ContentOverlay'
import Tower_Model from './pages/Scene_Page/Tower_Model'
import Loader from './pages/Scene_Page/Loader'
import LabelsHTML from './pages/Scene_Page/LabelsHTML'
import HTMLElements from './pages/Scene_Page/HTMLElements'

const LazyStats = lazy(() => import('./pages/Scene_Page/Stats'))
const LazyDebugger = lazy(() => import('./pages/Scene_Page/Debugger'))
const LazyHTMLDebugger = lazy(() => import('./pages/Scene_Page/HTMLDebugger'))

//@REDUX-TOOLKIT SETUP

import { store } from './redux/store/store'
import { Provider, useSelector } from 'react-redux'
import { selectIsMonitoring_status } from './redux/selectors/useSelectors'

//@THREE JS FIBER IMPORTS

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'

//@PARENT COMPONENT

function App() {
  // const isPlayingBackgroundMusic = useSelector(selectIsPlayingBackgroundMusic)
  const isMonitoringSelected = useSelector(selectIsMonitoring_status)
  return (
    <div>
      <LabelsHTML />
      <Canvas
        performance={{ current: 1, min: 0.1, max: 1, debounce: 200 }}
        mode="concurrent"
        dpr={[1.5, 2]}
        gl={{
          antialias: true,
          alpha: false,
          physicallyCorrectLights: true,
          toneMapping: THREE.ReinhardToneMapping,
          outputEncoding: THREE.sRGBEncoding,
          powerPreference: 'high-performance'
        }}
        camera={{
          near: 0.1,
          far: cameraDepthLimit,
          fov: 75,
          position: [0, 5, 7]
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          position: 'fixed'
        }}
        //@ if you want to all properties (also RENDERER), access like below
        onCreated={(canvas) => {
          canvas.gl.setClearColor('#fff', 1)
        }}
      >
        {/* <fog attach="fog" args={['grey', 1, 30]} /> */}

        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={2} />
            <pointLight intensity={1.5} position={[10, 10, 10]} />
            <Tower_Model />
            <ContentOverlay />
            <CameraSwitcher />
            <Suspense fallback={<Loader />}>
              {developerMode && isMonitoringSelected && <LazyStats />}
              {developerMode && <LazyDebugger />}
            </Suspense>
          </Suspense>
        </Provider>
      </Canvas>
      {/*//@ RENDERING HTML ELEMENTS in the CONTAINER */}

      <div className="debugger-container">
        <Suspense fallback={<div>Loading...</div>}>
          {developerMode && <LazyHTMLDebugger />}
        </Suspense>
      </div>
      <div className="container">
        <HTMLElements />
        {/* {isPlayingBackgroundMusic && <AudioPlayer />} */}
      </div>
    </div>
  )
}

export default App
