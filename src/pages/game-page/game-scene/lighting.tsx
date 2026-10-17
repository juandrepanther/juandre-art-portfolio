import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  PointLight,
  ShaderMaterial
} from 'three'
import {
  animatedFragmentShader,
  animatedVertexShader,
  atmosphereFragmentShader,
  atmosphereVertexShader,
  particleFragmentShader,
  particleVertexShader
} from '../shaders'
import { createAtmosphereParticleData } from './helpers'

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
        uTime: { value: 0 }
      }}
      vertexShader={animatedVertexShader}
    />
  )
}

export function AtmosphereDome() {
  const materialRef = useRef<ShaderMaterial | null>(null)

  useFrame(({ clock }) => {
    if (!materialRef.current) {
      return
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh position={[0, 10, 0]}>
      <sphereGeometry args={[52, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={atmosphereFragmentShader}
        side={BackSide}
        uniforms={{
          uTime: { value: 0 }
        }}
        vertexShader={atmosphereVertexShader}
      />
    </mesh>
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
          uColorA: { value: new Color('#d8fff2') },
          uColorB: { value: new Color('#ffe6b8') },
          uTime: { value: 0 }
        }}
        vertexShader={particleVertexShader}
      />
    </points>
  )
}

export function CinematicLights() {
  const fillLightRef = useRef<PointLight | null>(null)
  const rimLightRef = useRef<PointLight | null>(null)

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime

    if (fillLightRef.current) {
      fillLightRef.current.position.set(
        Math.sin(elapsedTime * 0.35) * 11,
        5.5 + Math.sin(elapsedTime * 0.6) * 0.7,
        Math.cos(elapsedTime * 0.32) * 9
      )
      fillLightRef.current.intensity = 1.35 + Math.sin(elapsedTime * 1.1) * 0.18
    }

    if (rimLightRef.current) {
      rimLightRef.current.position.set(
        Math.cos(elapsedTime * 0.27) * -12,
        4.3 + Math.cos(elapsedTime * 0.5) * 0.8,
        Math.sin(elapsedTime * 0.3) * 10
      )
      rimLightRef.current.intensity = 1.1 + Math.cos(elapsedTime * 0.95) * 0.16
    }
  })

  return (
    <>
      <pointLight
        ref={fillLightRef}
        color="#8ff0d2"
        decay={2}
        distance={32}
        intensity={1.35}
        position={[8, 6, 4]}
      />
      <pointLight
        ref={rimLightRef}
        color="#ffd2a2"
        decay={2}
        distance={28}
        intensity={1.1}
        position={[-10, 4.5, -6]}
      />
    </>
  )
}
