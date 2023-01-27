import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  SSR,
  Vignette
} from '@react-three/postprocessing'
import React from 'react'

function Maze_Effects() {
  return (
    <EffectComposer>
      {/* <SSR /> */}
      {/* <DepthOfField
        focusDistance={0}
        focalLength={0.12}
        bokehScale={2}
        height={480}
      /> */}
      <Bloom luminanceThreshold={0} luminanceSmoothing={1.5} height={300} />
      {/* <Noise opacity={0.02} /> */}
      {/* <Vignette eskil={false} offset={0.0001} darkness={1.1} /> */}
    </EffectComposer>
  )
}

export default Maze_Effects
