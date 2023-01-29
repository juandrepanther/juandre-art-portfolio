import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

function Object_1() {
  // references
  const mesh_ref = useRef<any>()

  useFrame((state) => {
    // animated rotation
    mesh_ref.current.rotation.x += 0.005
    mesh_ref.current.rotation.y += 0.005
  })

  return (
    <mesh ref={mesh_ref} position={[0, 0, 20]}>
      <planeBufferGeometry attach="geometry" args={[10, 10, 50]} />
      <meshStandardMaterial
        side={2}
        metalness={1}
        roughness={0}
        opacity={1}
        transparent
      />
    </mesh>
  )
}

export default Object_1
