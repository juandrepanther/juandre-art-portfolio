import { Environment, KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Canvas } from '@react-three/fiber'
// import { Perf } from 'r3f-perf'
import { Suspense, useRef } from 'react'
import mobileSkyImage from 'assets/images/forest.jpg'
import type { IGameSceneProps } from '../helpers'
import RoundStage from './round-stage'
import {
  ENABLE_ALL_SHADER_EFFECTS,
  GAME_CONTROL_MAP,
  PLAYER_JUMP_GRAVITY
} from '../settings'
import { Bloom, EffectComposer, GodRays } from '@react-three/postprocessing'
import type { Mesh } from 'three'
import { BlendFunction, KernelSize, Resolution } from 'postprocessing'

function GameScene({
  bossHealthPercent,
  cameraHorizontalSnapKey,
  characterConfig,
  combatConfig,
  difficulty,
  gameMode,
  health,
  isActive,
  isBossPhase,
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
  onBossDefeated,
  onBossHealthChange,
  onHealthChange,
  onEnemyHit,
  onPlayerHitIndicator,
  playerName,
  roundKey,
  showHealthMeter
}: IGameSceneProps) {
  const sunRef = useRef<Mesh | null>(null)
  const shouldRenderVisualEffects =
    ENABLE_ALL_SHADER_EFFECTS && !isMobileViewport

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
          {/* {import.meta.env.DEV ? <Perf position="top-right" /> : null} */}
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
              bossHealthPercent={bossHealthPercent}
              cameraHorizontalSnapKey={cameraHorizontalSnapKey}
              characterConfig={characterConfig}
              combatConfig={combatConfig}
              difficulty={difficulty}
              gameMode={gameMode}
              health={health}
              isActive={isActive}
              isBossPhase={isBossPhase}
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
              onBossDefeated={onBossDefeated}
              onBossHealthChange={onBossHealthChange}
              onHealthChange={onHealthChange}
              onEnemyHit={onEnemyHit}
              onPlayerHitIndicator={onPlayerHitIndicator}
              playerName={playerName}
              key={`${gameMode}-${difficulty}-${roundKey}`}
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
                density={1.26}
                exposure={0.6}
                kernelSize={KernelSize.SMALL}
                resolutionX={Resolution.AUTO_SIZE}
                resolutionY={Resolution.AUTO_SIZE}
                samples={60}
                sun={sunRef}
                weight={2.4}
              />
              <Bloom
                intensity={0.4}
                kernelSize={KernelSize.LARGE}
                luminanceThreshold={0}
                luminanceSmoothing={0.2}
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
