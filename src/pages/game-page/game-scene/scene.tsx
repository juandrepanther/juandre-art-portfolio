import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import type { IGameSceneProps } from '../helpers'
import RoundStage from './round-stage'
import { scenePlayerJumpGravity } from './helpers'
import { gameControlMap } from '../settings'

function GameScene({
  difficulty,
  isActive,
  onHealthChange,
  onMonkeyHit,
  roundKey
}: IGameSceneProps) {
  return (
    <KeyboardControls map={gameControlMap}>
      <Canvas
        camera={{ far: 140, fov: 42, near: 0.1, position: [0, 5, 14] }}
        dpr={[1, 1.8]}
        fallback={<div>WebGL is unavailable.</div>}
        id="game-scene-canvas"
        shadows
      >
        <Suspense fallback={null}>
          <Physics
            colliders={false}
            debug={import.meta.env.DEV}
            gravity={[0, -scenePlayerJumpGravity, 0]}
          >
            <RoundStage
              difficulty={difficulty}
              isActive={isActive}
              onHealthChange={onHealthChange}
              onMonkeyHit={onMonkeyHit}
              key={`${difficulty}-${roundKey}`}
              roundKey={roundKey}
            />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}

export default GameScene
