import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Fog,
  FogExp2,
  Group,
  MeshBasicMaterial,
  PointLight,
  ShaderMaterial,
  SpotLight
} from 'three'
import {
  animatedFragmentShader,
  animatedVertexShader,
  atmosphereFragmentShader,
  groundFogFragmentShader,
  groundFogVertexShader,
  atmosphereVertexShader,
  particleFragmentShader,
  particleVertexShader
} from '../shaders'
import { createAtmosphereParticleData } from './helpers'
import {
  createLightningCooldown,
  createLightningStrike,
  getLightningFrameState
} from './lightning-helpers'
import {
  GAME_BACKGROUND_COLOR,
  GAME_FOG_COLOR,
  LIGHTNING_COLOR,
  LIGHTNING_DIRECTIONAL_LIGHT_BOOST,
  LIGHTNING_FLASH_POINT_DISTANCE,
  LIGHTNING_FLASH_POINT_HEIGHT,
  LIGHTNING_FLASH_POINT_INTENSITY,
  LIGHTNING_GLOW_COLOR,
  LIGHTNING_INITIAL_DELAY_SECONDS,
  LIGHTNING_SPOTLIGHT_BOOST
} from '../settings'

const baseBackgroundColor = new Color(GAME_BACKGROUND_COLOR)
const baseFogColor = new Color(GAME_FOG_COLOR)

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
          ...sharedLightningUniforms,
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
          uColorA: { value: new Color('#a5b0b6') },
          uColorB: { value: new Color('#d4dbe0') },
          ...sharedLightningUniforms,
          uTime: { value: 0 }
        }}
        vertexShader={particleVertexShader}
      />
    </points>
  )
}

export function GroundFog() {
  const nearFogMaterialRef = useRef<ShaderMaterial | null>(null)
  const wideFogMaterialRef = useRef<ShaderMaterial | null>(null)

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime

    if (nearFogMaterialRef.current) {
      nearFogMaterialRef.current.uniforms.uTime.value = elapsedTime
    }

    if (wideFogMaterialRef.current) {
      wideFogMaterialRef.current.uniforms.uTime.value = elapsedTime + 4.2
    }
  })

  return (
    <group>
      <mesh position={[0, 0.85, 0]} rotation={[-Math.PI / 2, 0.2, 0]}>
        <circleGeometry args={[21, 48]} />
        <shaderMaterial
          ref={nearFogMaterialRef}
          depthWrite={false}
          fragmentShader={groundFogFragmentShader}
          side={DoubleSide}
          transparent
          uniforms={{
            ...sharedLightningUniforms,
            uTime: { value: 0 }
          }}
          vertexShader={groundFogVertexShader}
        />
      </mesh>
      <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, -0.35, 0]}>
        <circleGeometry args={[30, 48]} />
        <shaderMaterial
          ref={wideFogMaterialRef}
          depthWrite={false}
          fragmentShader={groundFogFragmentShader}
          side={DoubleSide}
          transparent
          uniforms={{
            ...sharedLightningUniforms,
            uTime: { value: 0 }
          }}
          vertexShader={groundFogVertexShader}
        />
      </mesh>
    </group>
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
        color="#7f9099"
        decay={2}
        distance={32}
        intensity={0.8}
        position={[8, 6, 4]}
      />
      <pointLight
        ref={rimLightRef}
        color="#a9b7c4"
        decay={2}
        distance={28}
        intensity={0.72}
        position={[-10, 4.5, -6]}
      />
    </>
  )
}

interface IStormLightning {
  directionalLightRef: RefObject<DirectionalLight | null>
  spotlightRef: RefObject<SpotLight | null>
}

export function StormLightning({
  directionalLightRef,
  spotlightRef
}: IStormLightning) {
  const { scene } = useThree()
  const flashLightRef = useRef<PointLight | null>(null)
  const boltGroupRef = useRef<Group | null>(null)
  const boltCoreMaterialRef = useRef<MeshBasicMaterial | null>(null)
  const boltCrossMaterialRef = useRef<MeshBasicMaterial | null>(null)
  const boltAuraMaterialRef = useRef<MeshBasicMaterial | null>(null)
  const nextStrikeAtRef = useRef(LIGHTNING_INITIAL_DELAY_SECONDS)
  const activeStrikeRef = useRef<ReturnType<
    typeof createLightningStrike
  > | null>(null)
  const baseDirectionalIntensityRef = useRef<number | null>(null)
  const baseSpotlightIntensityRef = useRef<number | null>(null)
  const baseDirectionalColorRef = useRef<Color | null>(null)
  const baseSpotlightColorRef = useRef<Color | null>(null)
  const lightningTintRef = useRef(new Color(LIGHTNING_COLOR))
  const boostedBackgroundColorRef = useRef(new Color(GAME_BACKGROUND_COLOR))
  const boostedFogColorRef = useRef(new Color(GAME_FOG_COLOR))

  useEffect(() => {
    const directionalLight = directionalLightRef.current
    const spotlight = spotlightRef.current
    const flashLight = flashLightRef.current
    const boltGroup = boltGroupRef.current

    return () => {
      sharedLightningUniforms.uLightningBranchOffset.value = 0
      sharedLightningUniforms.uLightningIntensity.value = 0
      sharedLightningUniforms.uLightningSeed.value = 0
      sharedLightningUniforms.uLightningSpread.value = 0
      sharedLightningUniforms.uLightningStrikeX.value = 0
      sharedLightningUniforms.uLightningStrikeZ.value = 0

      if (directionalLight && baseDirectionalIntensityRef.current !== null) {
        directionalLight.intensity = baseDirectionalIntensityRef.current
      }

      if (directionalLight && baseDirectionalColorRef.current) {
        directionalLight.color.copy(baseDirectionalColorRef.current)
      }

      if (spotlight && baseSpotlightIntensityRef.current !== null) {
        spotlight.intensity = baseSpotlightIntensityRef.current
      }

      if (spotlight && baseSpotlightColorRef.current) {
        spotlight.color.copy(baseSpotlightColorRef.current)
      }

      if (flashLight) {
        flashLight.intensity = 0
      }

      if (boltGroup) {
        boltGroup.visible = false
      }

      if (scene.background instanceof Color) {
        scene.background.copy(baseBackgroundColor)
      }

      if (scene.fog instanceof Fog || scene.fog instanceof FogExp2) {
        scene.fog.color.copy(baseFogColor)
      }
    }
  }, [directionalLightRef, scene, spotlightRef])

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime
    const directionalLight = directionalLightRef.current
    const spotlight = spotlightRef.current

    if (directionalLight && baseDirectionalIntensityRef.current === null) {
      baseDirectionalIntensityRef.current = directionalLight.intensity
    }

    if (directionalLight && !baseDirectionalColorRef.current) {
      baseDirectionalColorRef.current = directionalLight.color.clone()
    }

    if (spotlight && baseSpotlightIntensityRef.current === null) {
      baseSpotlightIntensityRef.current = spotlight.intensity
    }

    if (spotlight && !baseSpotlightColorRef.current) {
      baseSpotlightColorRef.current = spotlight.color.clone()
    }

    if (!activeStrikeRef.current && elapsedTime >= nextStrikeAtRef.current) {
      activeStrikeRef.current = createLightningStrike(elapsedTime)
      nextStrikeAtRef.current =
        elapsedTime +
        activeStrikeRef.current.duration +
        createLightningCooldown()
    }

    const strike = activeStrikeRef.current

    if (!strike) {
      sharedLightningUniforms.uLightningBranchOffset.value = 0
      sharedLightningUniforms.uLightningIntensity.value = 0
      sharedLightningUniforms.uLightningSeed.value = 0
      sharedLightningUniforms.uLightningSpread.value = 0

      if (flashLightRef.current) {
        flashLightRef.current.intensity = 0
      }

      if (boltGroupRef.current) {
        boltGroupRef.current.visible = false
      }

      if (directionalLight && baseDirectionalIntensityRef.current !== null) {
        directionalLight.intensity = baseDirectionalIntensityRef.current
      }

      if (directionalLight && baseDirectionalColorRef.current) {
        directionalLight.color.copy(baseDirectionalColorRef.current)
      }

      if (spotlight && baseSpotlightIntensityRef.current !== null) {
        spotlight.intensity = baseSpotlightIntensityRef.current
      }

      if (spotlight && baseSpotlightColorRef.current) {
        spotlight.color.copy(baseSpotlightColorRef.current)
      }

      if (scene.background instanceof Color) {
        scene.background.copy(baseBackgroundColor)
      }

      if (scene.fog instanceof Fog || scene.fog instanceof FogExp2) {
        scene.fog.color.copy(baseFogColor)
      }

      return
    }

    const frameState = getLightningFrameState(strike, elapsedTime)

    if (frameState.isComplete) {
      activeStrikeRef.current = null
      return
    }

    sharedLightningUniforms.uLightningBranchOffset.value =
      frameState.branchOffset
    sharedLightningUniforms.uLightningIntensity.value =
      frameState.boltVisibility
    sharedLightningUniforms.uLightningSeed.value = strike.seed
    sharedLightningUniforms.uLightningSpread.value = strike.spread
    sharedLightningUniforms.uLightningStrikeX.value = strike.x
    sharedLightningUniforms.uLightningStrikeZ.value = strike.z

    if (flashLightRef.current) {
      flashLightRef.current.position.set(
        strike.x,
        LIGHTNING_FLASH_POINT_HEIGHT,
        strike.z
      )
      flashLightRef.current.intensity =
        frameState.flashIntensity * LIGHTNING_FLASH_POINT_INTENSITY
    }

    if (boltGroupRef.current) {
      const boltScale = 0.92 + frameState.boltVisibility * 0.38

      boltGroupRef.current.visible = true
      boltGroupRef.current.position.set(
        strike.x + frameState.branchOffset * 0.12,
        10.5,
        strike.z
      )
      boltGroupRef.current.scale.set(
        boltScale,
        1 + frameState.boltVisibility * 0.16,
        boltScale
      )
      boltGroupRef.current.rotation.y = strike.seed * Math.PI * 2
    }

    if (boltCoreMaterialRef.current) {
      boltCoreMaterialRef.current.opacity = Math.min(
        1,
        frameState.boltVisibility * 1.15
      )
    }

    if (boltCrossMaterialRef.current) {
      boltCrossMaterialRef.current.opacity = Math.min(
        0.92,
        frameState.boltVisibility * 0.88
      )
    }

    if (boltAuraMaterialRef.current) {
      boltAuraMaterialRef.current.opacity = Math.min(
        0.5,
        frameState.ambientLift * 0.55
      )
    }

    if (directionalLight && baseDirectionalIntensityRef.current !== null) {
      directionalLight.intensity =
        baseDirectionalIntensityRef.current +
        frameState.flashIntensity * LIGHTNING_DIRECTIONAL_LIGHT_BOOST
      if (baseDirectionalColorRef.current) {
        directionalLight.color
          .copy(baseDirectionalColorRef.current)
          .lerp(lightningTintRef.current, frameState.ambientLift * 0.5)
      }
    }

    if (spotlight && baseSpotlightIntensityRef.current !== null) {
      spotlight.intensity =
        baseSpotlightIntensityRef.current +
        frameState.flashIntensity * LIGHTNING_SPOTLIGHT_BOOST
      if (baseSpotlightColorRef.current) {
        spotlight.color
          .copy(baseSpotlightColorRef.current)
          .lerp(lightningTintRef.current, frameState.ambientLift * 0.45)
      }
    }

    boostedBackgroundColorRef.current
      .copy(baseBackgroundColor)
      .lerp(lightningTintRef.current, frameState.ambientLift * 0.3)
    boostedFogColorRef.current
      .copy(baseFogColor)
      .lerp(lightningTintRef.current, frameState.ambientLift * 0.38)

    if (scene.background instanceof Color) {
      scene.background.copy(boostedBackgroundColorRef.current)
    }

    if (scene.fog instanceof Fog || scene.fog instanceof FogExp2) {
      scene.fog.color.copy(boostedFogColorRef.current)
    }
  })

  return (
    <>
      <pointLight
        ref={flashLightRef}
        color={LIGHTNING_COLOR}
        decay={2}
        distance={LIGHTNING_FLASH_POINT_DISTANCE}
        intensity={0}
        position={[0, LIGHTNING_FLASH_POINT_HEIGHT, 0]}
      />
      <group ref={boltGroupRef} visible={false}>
        <mesh position={[0, 0.25, 0]}>
          <planeGeometry args={[0.9, 22]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={LIGHTNING_COLOR}
            depthWrite={false}
            opacity={0}
            ref={boltCoreMaterialRef}
            side={DoubleSide}
            transparent
          />
        </mesh>
        <mesh position={[0.14, 1.1, 0]} rotation={[0, Math.PI / 3, 0]}>
          <planeGeometry args={[0.52, 16]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={LIGHTNING_GLOW_COLOR}
            depthWrite={false}
            opacity={0}
            ref={boltCrossMaterialRef}
            side={DoubleSide}
            transparent
          />
        </mesh>
        <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.8, 24]} />
          <meshBasicMaterial
            blending={AdditiveBlending}
            color={LIGHTNING_GLOW_COLOR}
            depthWrite={false}
            opacity={0}
            ref={boltAuraMaterialRef}
            side={DoubleSide}
            transparent
          />
        </mesh>
      </group>
    </>
  )
}
