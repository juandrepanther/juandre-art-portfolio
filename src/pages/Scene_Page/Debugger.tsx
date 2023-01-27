import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store/store'
import { IDebugger } from '../../types'

const Debugger = ({
  color = 'mediumpurple',
  size = [0.03, 16, 16]
}: IDebugger) => {
  const { x, y, z, helperBallrotate } = useSelector(
    (state: RootState) => state.debugger_reducer
  )
  return (
    <mesh position={[x, y, z]}>
      <meshStandardMaterial
        color={color}
        attach="material"
        roughness={0.1}
        metalness={0.1}
      />
      <sphereGeometry args={size} />
      <gridHelper
        rotation={
          !helperBallrotate
            ? [Math.PI / 2, 0, 0]
            : [Math.PI / 2, 0, Math.PI / 2]
        }
        args={[0.4, 10, 'orange', 'orange']}
      />
      <axesHelper />
    </mesh>
  )
}

export default Debugger
