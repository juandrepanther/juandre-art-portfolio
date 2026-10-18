import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { TREE_TRUNK_COLLIDER_ARGS, type ITreeLayout } from '../../helpers'
import { getTreeVariant } from '../helpers'
import { EvergreenTree } from './evergreen-tree'

interface ITreeCluster {
  treeLayouts: ITreeLayout[]
}

export function TreeCluster({ treeLayouts }: ITreeCluster) {
  return (
    <group>
      {treeLayouts.map(({ treePosition }, index) => (
        <RigidBody
          colliders={false}
          key={`tree-${index}`}
          position={treePosition}
          rotation={[0, (index % 2 === 0 ? 1 : -1) * 0.18 * (index + 1), 0]}
          type="fixed"
        >
          <CuboidCollider
            args={TREE_TRUNK_COLLIDER_ARGS}
            position={[0, 1.95, 0]}
          />
          <EvergreenTree variant={getTreeVariant(index)} />
        </RigidBody>
      ))}
    </group>
  )
}
