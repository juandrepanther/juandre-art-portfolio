import { Environment, KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Suspense, useRef } from 'react'
import type { IGameSceneProps } from '../helpers'
import RoundStage from './round-stage'
import { GAME_CONTROL_MAP, PLAYER_JUMP_GRAVITY } from '../settings'
import { Bloom, EffectComposer, GodRays } from '@react-three/postprocessing'
import type { Mesh } from 'three'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'

function GameScene({
  characterConfig,
  difficultyConfig,
  difficulty,
  health,
  isActive,
  isCameraOrbiting,
  onHealthChange,
  onEnemyHit,
  roundKey,
  showHealthMeter
}: IGameSceneProps) {
  const sunRef = useRef<Mesh | null>(null)

  return (
    <KeyboardControls map={GAME_CONTROL_MAP}>
      <Canvas
        camera={{ far: 140, fov: 42, near: 0.1, position: [0, 5, 14] }}
        dpr={[1, 1.8]}
        fallback={<div>WebGL is unavailable.</div>}
        id="game-scene-canvas"
        shadows
      >
        <Suspense fallback={null}>
          {import.meta.env.DEV ? <Perf position="top-right" /> : null}
          <Environment preset="forest" background backgroundBlurriness={0.4} />
          <Physics
            colliders={false}
            debug={import.meta.env.DEV}
            gravity={[0, -PLAYER_JUMP_GRAVITY, 0]}
          >
            <mesh position={[60, 22, -48]} ref={sunRef}>
              <sphereGeometry args={[3.5, 32, 32]} />
              <meshBasicMaterial
                color="#fff4c2"
                depthWrite={false}
                toneMapped={false}
                transparent
              />
            </mesh>
            <RoundStage
              characterConfig={characterConfig}
              difficultyConfig={difficultyConfig}
              difficulty={difficulty}
              health={health}
              isActive={isActive}
              isCameraOrbiting={isCameraOrbiting}
              onHealthChange={onHealthChange}
              onEnemyHit={onEnemyHit}
              key={`${difficulty}-${characterConfig.id}-${roundKey}`}
              roundKey={roundKey}
              showHealthMeter={showHealthMeter}
            />
          </Physics>
          <EffectComposer enabled={true}>
            <GodRays
              blur={true}
              blendFunction={BlendFunction.SCREEN}
              clampMax={11}
              decay={0.9}
              density={0.96}
              exposure={0.6}
              kernelSize={KernelSize.SMALL}
              resolutionX={Resolution.AUTO_SIZE}
              resolutionY={Resolution.AUTO_SIZE}
              samples={60}
              sun={sunRef}
              weight={2.4}
            />

            <Bloom
              intensity={10} // The bloom intensity.
              kernelSize={KernelSize.LARGE} // blur kernel size
              luminanceThreshold={0.8} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
              mipmapBlur={false} // Enables or disables mipmap blur.
              resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
              resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}

export default GameScene
