import { Box } from '@mui/material'
import { isMobile } from 'react-device-detect'
import { ChromaFlow, FlutedGlass, Shader, Swirl } from 'shaders/react'

function StaticGlassBackground() {
  return (
    <Box
      data-testid="static-glass-background"
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 16% 18%, rgba(127, 102, 255, 0.26) 0%, transparent 28%), radial-gradient(circle at 82% 22%, rgba(86, 194, 252, 0.22) 0%, transparent 24%), radial-gradient(circle at 50% 78%, rgba(255, 255, 255, 0.12) 0%, transparent 26%), linear-gradient(155deg, rgba(8, 12, 18, 0.98) 0%, rgba(17, 28, 42, 0.96) 48%, rgba(12, 17, 23, 1) 100%)'
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: '8% 10% auto auto',
          width: '44vw',
          maxWidth: 280,
          aspectRatio: '1 / 1',
          borderRadius: '32px',
          transform: 'rotate(14deg)',
          border: '1px solid rgba(220, 229, 236, 0.22)',
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 24px 80px rgba(4, 10, 18, 0.34)'
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 'auto auto 14% -8%',
          width: '58vw',
          maxWidth: 340,
          aspectRatio: '1 / 1',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(86, 194, 252, 0.22) 0%, rgba(86, 194, 252, 0.08) 42%, transparent 72%)',
          filter: 'blur(8px)'
        }}
      />
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
          backgroundSize: 'clamp(72px, 14vw, 110px) clamp(72px, 14vw, 110px)',
          maskImage:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.24) 100%)',
          opacity: 0.5
        }}
      />
    </Box>
  )
}

function GlassBackground() {
  if (isMobile) {
    return <StaticGlassBackground />
  }

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
