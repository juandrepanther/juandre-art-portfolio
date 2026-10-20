import { Html, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Box, CircularProgress, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Suspense } from 'react'
import type { ICharacterConfig } from '../settings'
import CharacterModel from './character-model'

interface ICharacterPreview {
  characterConfig: ICharacterConfig
}

function CharacterPreviewLoader() {
  return (
    <Html center>
      <Box
        role="status"
        aria-busy="true"
        aria-live="polite"
        sx={{
          display: 'grid',
          justifyItems: 'center',
          gap: 1,
          px: 2,
          py: 1.5,
          borderRadius: 2,
          border: '1px solid rgba(238, 246, 255, 0.24)',
          backgroundColor: 'rgba(7, 12, 20, 0.66)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(240, 247, 255, 0.92)',
          pointerEvents: 'none'
        }}
      >
        <CircularProgress aria-label="Loading character model" size={28} />
        <Typography sx={{ fontSize: 12, letterSpacing: '0.04em' }}>
          Loading character...
        </Typography>
      </Box>
    </Html>
  )
}

function CharacterPreview({ characterConfig }: ICharacterPreview) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 420,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
        background:
          'radial-gradient(circle at 50% 18%, rgba(184, 220, 255, 0.28) 0%, rgba(10, 16, 24, 0.94) 56%, rgba(4, 7, 12, 1) 100%)',
        boxShadow: `inset 0 1px 0 ${alpha(theme.palette.common.white, 0.08)}`
      }}
    >
      <Canvas
        camera={{ fov: 34, near: 0.1, far: 10, position: [0, 1.65, 5.4] }}
        dpr={[1, 1.6]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={1.6} />
        <directionalLight castShadow intensity={2.2} position={[5, 8, 6]} />
        <spotLight
          angle={0.36}
          intensity={22}
          penumbra={0.8}
          position={[-4, 7, 5]}
        />
        <Suspense fallback={<CharacterPreviewLoader />}>
          <group key={characterConfig.id} position={[-0.2, -1.8, 0]}>
            <CharacterModel
              characterConfig={characterConfig}
              groundOffset={0}
              modelTransformOverride={{
                offset: characterConfig.chooserModelOffset,
                rotation: characterConfig.chooserModelRotation,
                scale: characterConfig.chooserModelScale
              }}
            />
          </group>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 1.9}
          minPolarAngle={Math.PI / 3.8}
          autoRotate
          autoRotateSpeed={5}
        />
      </Canvas>
    </Box>
  )
}

export default CharacterPreview
