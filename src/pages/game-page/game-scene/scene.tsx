import { Environment, KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Suspense, useRef } from 'react'
import mobileSkyImage from 'assets/images/forest.jpg'
import type { IGameSceneProps } from '../helpers'
import RoundStage from './round-stage'
import { GAME_CONTROL_MAP, PLAYER_JUMP_GRAVITY } from '../settings'
import { Bloom, EffectComposer, GodRays } from '@react-three/postprocessing'
import type { Mesh } from 'three'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'

function GameScene({
  cameraHorizontalSnapKey,
  characterConfig,
  difficultyConfig,
  difficulty,
  health,
  isActive,
  isDevelopmentMode,
  isCameraOrbiting,
  isLandscapeMobile,
  isMobileViewport,
  mobileJumpPressCount,
  mobileLookAccumulatorX,
  mobileLookAccumulatorY,
  mobileMoveVectorX,
  mobileMoveVectorY,
  mobileShootPressCount,
  showMobileControls,
  onHealthChange,
  onEnemyHit,
  onPlayerHitIndicator,
  playerName,
  roundKey,
  showHealthMeter
}: IGameSceneProps) {
  const sunRef = useRef<Mesh | null>(null)
  const shouldRenderVisualEffects = !isMobileViewport

  return (
    <KeyboardControls map={GAME_CONTROL_MAP}>
      <Canvas
        camera={{ far: 140, fov: 42, near: 0.1, position: [0, 5, 14] }}
        dpr={[1, 1.8]}
        fallback={<div>WebGL is unavailable.</div>}
        id="game-scene-canvas"
        shadows={shouldRenderVisualEffects}
      >
        <Suspense fallback={null}>
          {import.meta.env.DEV ? <Perf position="top-right" /> : null}
          {shouldRenderVisualEffects ? (
            <Environment
              preset="forest"
              background={true}
              backgroundBlurriness={0.4}
            />
          ) : (
            <Environment files={mobileSkyImage} background={true} />
          )}
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
              cameraHorizontalSnapKey={cameraHorizontalSnapKey}
              characterConfig={characterConfig}
              difficultyConfig={difficultyConfig}
              difficulty={difficulty}
              health={health}
              isActive={isActive}
              isDevelopmentMode={isDevelopmentMode}
              isCameraOrbiting={isCameraOrbiting}
              isLandscapeMobile={isLandscapeMobile}
              isMobileViewport={isMobileViewport}
              mobileJumpPressCount={mobileJumpPressCount}
              mobileLookAccumulatorX={mobileLookAccumulatorX}
              mobileLookAccumulatorY={mobileLookAccumulatorY}
              mobileMoveVectorX={mobileMoveVectorX}
              mobileMoveVectorY={mobileMoveVectorY}
              mobileShootPressCount={mobileShootPressCount}
              showMobileControls={showMobileControls}
              onHealthChange={onHealthChange}
              onEnemyHit={onEnemyHit}
              onPlayerHitIndicator={onPlayerHitIndicator}
              playerName={playerName}
              key={`${difficulty}-${characterConfig.id}-${roundKey}`}
              roundKey={roundKey}
              showHealthMeter={showHealthMeter}
            />
          </Physics>
          {shouldRenderVisualEffects ? (
            <EffectComposer enabled={true} autoClear={false}>
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
                intensity={10}
                kernelSize={KernelSize.LARGE}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.025}
                mipmapBlur={false}
                resolutionX={Resolution.AUTO_SIZE}
                resolutionY={Resolution.AUTO_SIZE}
              />
            </EffectComposer>
          ) : null}
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}

export default GameScene
