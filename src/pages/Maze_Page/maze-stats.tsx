import { useFrame } from '@react-three/fiber'
import { useState } from 'react'
import FPS from 'stats.js'
import THREEx from '../../utils/drawCalls/threex.rendererstats.js'

function MazeStats() {
  const drawCallsStats = THREEx.RendererStats()
  drawCallsStats.domElement.style.position = 'absolute'
  drawCallsStats.domElement.style.left = '0px'
  drawCallsStats.domElement.style.bottom = '0px'
  document.body.appendChild(drawCallsStats.domElement)

  const [stats] = useState(() => new FPS())

  useFrame(({ gl }) => {
    drawCallsStats.update(gl)
    stats.showPanel(0)

    const fpsMeter = stats.dom
    fpsMeter.style.cssText = 'position:absolute;bottom:0px;right:0px;'
    fpsMeter.setAttribute('class', 'FPSMeterContainer')
    document.body.appendChild(fpsMeter)

    return () => document.body.removeChild(stats.dom)
  })

  return useFrame((state) => {
    stats.begin()
    state.gl.render(state.scene, state.camera)
    stats.end()
  }, 1)
}

export default MazeStats