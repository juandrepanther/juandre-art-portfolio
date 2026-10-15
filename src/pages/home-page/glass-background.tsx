import { Box } from '@mui/material'
import { ChromaFlow, FlutedGlass, Shader, Swirl } from 'shaders/react'

interface IGlassBackground {
  isReducedMotion?: boolean
}

function GlassBackground({ isReducedMotion = false }: IGlassBackground) {
  void isReducedMotion

  return (
    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Shader className="shader-fill">
        <Swirl colorA="#ffffff" colorB="#f0f0f5" detail={1.5} />
        <ChromaFlow
          baseColor="#ffffff"
          downColor="#4642ff"
          leftColor="#56c2fc"
          radius={4}
          rightColor="#5b4fff"
          upColor="#7f66ff"
        />
        <FlutedGlass
          aberration={0}
          angle={30}
          frequency={8}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
        />
      </Shader>
    </Box>
  )
}

export default GlassBackground
