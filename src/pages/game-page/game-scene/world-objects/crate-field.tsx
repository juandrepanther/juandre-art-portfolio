import type { RefObject } from 'react'
import type { ICrateLayout } from '../../helpers'
import type { TDifficultyLevel } from '../../settings'
import { CrateObstacle } from './crate-obstacle'

interface ICrateField {
  animatedCrateFlagsRef: RefObject<boolean[]>
  crateAnimationOffsets: number[]
  crateLayouts: ICrateLayout[]
  difficulty: TDifficultyLevel
  shouldRenderVisualEffects: boolean
}

export function CrateField({
  animatedCrateFlagsRef,
  crateAnimationOffsets,
  crateLayouts,
  difficulty,
  shouldRenderVisualEffects
}: ICrateField) {
  return (
    <group>
      {crateLayouts.map((crateLayout, index) => (
        <CrateObstacle
          animatedCrateFlagsRef={animatedCrateFlagsRef}
          animationOffset={crateAnimationOffsets[index]}
          crateLayout={crateLayout}
          difficulty={difficulty}
          index={index}
          key={`crate-${index}`}
          shouldRenderVisualEffects={shouldRenderVisualEffects}
        />
      ))}
    </group>
  )
}
