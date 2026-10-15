import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'

type IShadersReactModule = Pick<
  typeof import('shaders/react'),
  'Shader' | 'Swirl' | 'ChromaFlow' | 'FlutedGlass'
>

interface IGlassBackground {
  isReducedMotion?: boolean
}

function isRenderableComponent(
  value: unknown
): value is ComponentType<unknown> {
  return (
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && '$$typeof' in value)
  )
}

function canRenderAnimatedShader() {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window
}

function StaticGlassBackground() {
  return (
    <Box
      aria-label="Static visual fallback"
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(circle at top left, rgba(84, 199, 184, 0.22), transparent 34%), radial-gradient(circle at top right, rgba(217, 139, 79, 0.18), transparent 28%), linear-gradient(180deg, rgba(12, 17, 23, 0.18) 0%, rgba(12, 17, 23, 0.82) 68%, rgba(12, 17, 23, 0.98) 100%)'
      }}
    />
  )
}

function GlassBackground({ isReducedMotion = false }: IGlassBackground) {
  const [shadersModule, setShadersModule] =
    useState<IShadersReactModule | null>(null)

  useEffect(() => {
    let isMounted = true

    if (isReducedMotion || !canRenderAnimatedShader()) {
      return () => {
        isMounted = false
      }
    }

    void import('shaders/react')
      .then((module) => {
        if (!isMounted) {
          return
        }

        const { ChromaFlow, FlutedGlass, Shader, Swirl } = module

        if (
          !isRenderableComponent(Shader) ||
          !isRenderableComponent(Swirl) ||
          !isRenderableComponent(ChromaFlow) ||
          !isRenderableComponent(FlutedGlass)
        ) {
          setShadersModule(null)

          return
        }

        setShadersModule({ ChromaFlow, FlutedGlass, Shader, Swirl })
      })
      .catch(() => {
        if (isMounted) {
          setShadersModule(null)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isReducedMotion])

  if (!shadersModule) {
    return <StaticGlassBackground />
  }

  const { ChromaFlow, FlutedGlass, Shader, Swirl } = shadersModule

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
