import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import THREEx from '../../utils/drawCalls/threex.rendererstats.js'
import FPS from 'stats.js'

const Stats = () => {
  const drawCallsStats = THREEx.RendererStats()
  drawCallsStats.domElement.style.position = 'absolute'
  drawCallsStats.domElement.style.left = '0px'
  drawCallsStats.domElement.style.bottom = '0px'
  document.body.appendChild(drawCallsStats.domElement)

  const [stats] = useState(() => new FPS())

  useFrame(({ gl }) => {
    drawCallsStats.update(gl)
    stats.showPanel(0)

    //information for panels from documentation
    /*
        0 - FPS Frames rendered in the last second. The higher the number the better. (on my PC: 60 FPS, laptop: 20 (bad))
        1 - MS Milliseconds needed to render a frame. The lower the number the better. (on my PC: 1, laptop 2-8)
        2 - MB MBytes of allocated memory. (Run Chrome with --enable-precise-memory-info) (on my PC: 30 - 42, laptop 26)
        3 - CUSTOM User-defined panel support.
    */
    const fpsMeter = stats.dom
    fpsMeter.style.cssText = 'position:absolute;bottom:0px;right:0px;'
    fpsMeter.setAttribute('class', `FPSMeterContainer`)
    document.body.appendChild(fpsMeter)

    return () => document.body.removeChild(stats.dom)
  })
  return useFrame((state) => {
    stats.begin()
    state.gl.render(state.scene, state.camera)
    stats.end()
  }, 1)
}

export default Stats
