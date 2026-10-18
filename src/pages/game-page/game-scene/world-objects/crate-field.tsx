import type { ICrateLayout } from '../../helpers'
import { CrateObstacle } from './crate-obstacle'

interface ICrateField {
  crateLayouts: ICrateLayout[]
}

export function CrateField({ crateLayouts }: ICrateField) {
  return (
    <group>
      {crateLayouts.map((crateLayout, index) => (
        <CrateObstacle
          crateLayout={crateLayout}
          index={index}
          key={`crate-${index}`}
        />
      ))}
    </group>
  )
}
