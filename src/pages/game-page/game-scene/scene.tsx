import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import type { IGameSceneProps } from '../helpers'
import RoundStage from './round-stage'
import { GAME_CONTROL_MAP, PLAYER_JUMP_GRAVITY } from '../settings'

function GameScene({
  difficultyConfig,
  difficulty,
  isActive,
  onHealthChange,
  onEnemyHit,
  roundKey
}: IGameSceneProps) {
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
          <Physics
            colliders={false}
            debug={import.meta.env.DEV}
            gravity={[0, -PLAYER_JUMP_GRAVITY, 0]}
          >
            <RoundStage
              difficultyConfig={difficultyConfig}
              difficulty={difficulty}
              isActive={isActive}
              onHealthChange={onHealthChange}
              onEnemyHit={onEnemyHit}
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
