import type { ICrateLayout } from '../../helpers'
import { CrateObstacle } from './crate-obstacle'

interface ICrateField {
  crateLayouts: ICrateLayout[]
  shouldRenderVisualEffects: boolean
}

export function CrateField({
  crateLayouts,
  shouldRenderVisualEffects
}: ICrateField) {
  return (
    <group>
      {crateLayouts.map((crateLayout, index) => (
        <CrateObstacle
          crateLayout={crateLayout}
          index={index}
          key={`crate-${index}`}
          shouldRenderVisualEffects={shouldRenderVisualEffects}
        />
      ))}
    </group>
  )
}
