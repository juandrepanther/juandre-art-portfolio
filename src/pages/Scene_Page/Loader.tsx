import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

function Loader() {
  const loaderRef2 = useRef(null)

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()

    loaderRef2.current.scale.x = Math.sin(elapsedTime * 3)
    loaderRef2.current.scale.y = Math.sin(elapsedTime * 3)
  })

  return (
    <mesh ref={loaderRef2} position={[0, 0, 0]}>
      <ringBufferGeometry args={[1.0, 1.05, 50]} />
      <meshBasicMaterial color="#fff" opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default Loader
