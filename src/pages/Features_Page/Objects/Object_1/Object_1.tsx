import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { cameraTargetsTypes } from '../../../../types'

function Object_1({ object_1 }: Pick<cameraTargetsTypes, 'object_1'>) {
  // references
  const mesh_ref = useRef<any>()

  useFrame(() => {
    // animated rotation
    mesh_ref.current.rotation.x += 0.005
    mesh_ref.current.rotation.y += 0.005
  })

  return (
    <mesh ref={mesh_ref} position={object_1}>
      <planeBufferGeometry attach="geometry" args={[10, 10, 1]} />
      <meshStandardMaterial
        side={2}
        metalness={1}
        roughness={0}
        opacity={1}
        transparent
        wireframe={false}
      />
    </mesh>
  )
}

export default Object_1
