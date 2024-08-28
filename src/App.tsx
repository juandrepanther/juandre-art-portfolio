import { cameraDepthLimit, developerMode } from './data/ContentData'
import React, { lazy, Suspense } from 'react'
import CameraControls from 'camera-controls'
CameraControls.install({ THREE })
import Tower_Model from './pages/Scene_Page/Tower_Model'
import Loader from './pages/Scene_Page/Loader'
import LabelsHTML from './pages/Scene_Page/LabelsHTML'
import HTMLElements from './pages/Scene_Page/HTMLElements'
import { store } from './redux/store/store'
import { Provider } from 'react-redux'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import Camera from './pages/Scene_Page/Camera'

const LazyStats = lazy(() => import('./pages/Scene_Page/Stats'))

function App() {
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
          fov: 75
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          position: 'fixed'
        }}
        onCreated={(canvas) => {
          canvas.gl.setClearColor('#fff', 1)
        }}
      >
        <Provider store={store}>
          <Suspense fallback={<Loader />}>
            <Tower_Model />
            <Camera />
            <Suspense fallback={<Loader />}>
              {developerMode && <LazyStats />}
            </Suspense>
          </Suspense>
        </Provider>
      </Canvas>

      <div className="container">
        <HTMLElements />
      </div>
    </div>
  )
}

export default App
