import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  ShaderMaterial
} from 'three'
import {
  animatedFragmentShader,
  animatedVertexShader,
  particleFragmentShader,
  particleVertexShader
} from '../shaders'
import { createAtmosphereParticleData } from './helpers'
import { LIGHTNING_GLOW_COLOR } from '../settings'

const sharedLightningUniforms = {
  uLightningBranchOffset: { value: 0 },
  uLightningColor: { value: new Color(LIGHTNING_GLOW_COLOR) },
  uLightningIntensity: { value: 0 },
  uLightningSeed: { value: 0 },
  uLightningSpread: { value: 0 },
  uLightningStrikeX: { value: 0 },
  uLightningStrikeZ: { value: 0 }
}

interface IAnimatedSurfaceMaterial {
  accentColor: string
  amplitude: number
  baseColor: string
}

export function AnimatedSurfaceMaterial({
  accentColor,
  amplitude,
  baseColor
}: IAnimatedSurfaceMaterial) {
  const materialRef = useRef<ShaderMaterial | null>(null)

  useFrame(({ clock }) => {
    if (!materialRef.current) {
      return
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <shaderMaterial
      ref={materialRef}
      fragmentShader={animatedFragmentShader}
      uniforms={{
        uAccentColor: { value: new Color(accentColor) },
        uAmplitude: { value: amplitude },
        uBaseColor: { value: new Color(baseColor) },
        ...sharedLightningUniforms,
        uTime: { value: 0 }
      }}
      vertexShader={animatedVertexShader}
    />
  )
}

export function AtmosphereParticles() {
  const geometryRef = useRef<BufferGeometry | null>(null)
  const materialRef = useRef<ShaderMaterial | null>(null)
  const particleDataRef = useRef(createAtmosphereParticleData())

  useEffect(() => {
    if (!geometryRef.current) {
      return
    }

    geometryRef.current.setAttribute(
      'position',
      new Float32BufferAttribute(particleDataRef.current.positions, 3)
    )
    geometryRef.current.setAttribute(
      'aScale',
      new Float32BufferAttribute(particleDataRef.current.scales, 1)
    )
  }, [])

  useFrame(({ clock }) => {
    if (!materialRef.current) {
      return
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points position={[0, 0.5, 0]} rotation={[0, 0.18, 0]}>
      <bufferGeometry ref={geometryRef} />
      <shaderMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        depthWrite={false}
        fragmentShader={particleFragmentShader}
        transparent
        uniforms={{
          uColorA: { value: new Color('yellow') },
          uColorB: { value: new Color('#d4dbe0') },
          ...sharedLightningUniforms,
          uTime: { value: 0 }
        }}
        vertexShader={particleVertexShader}
      />
    </points>
  )
}
