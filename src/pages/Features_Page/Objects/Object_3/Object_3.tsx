import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

import vertexShader from './shader1.vert'
import fragmentShader from './shader1.frag'

function Object_3() {
  // variables for the Leva debugger
  const { axis_x, axis_y } = useControls({
    axis_x: { value: 0.5, step: 0.1, min: 0.0, max: 1.0 },
    axis_y: { value: 0.5, step: 0.1, min: 0.0, max: 1.0 }
  })

  // uniforms values

  const uniforms = {
    uTime: { value: 0 },
    uAxis: { value: new THREE.Vector2(axis_x, axis_y) }
  }

  // references
  const mesh_material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: 2,
    uniforms: uniforms
  })

  const onHoverHandler = (e: { spaceX: number; spaceY: number }) => {
    const coordinates = new THREE.Vector2(e.spaceX, e.spaceY)

    coordinates.x = (coordinates.x + 1) / 2
    coordinates.y = -(coordinates.y - 1) / 2

    uniforms.uAxis.value = new THREE.Vector2(coordinates.x, coordinates.y)
  }

  return (
    <mesh
      onPointerMove={onHoverHandler}
      material={mesh_material}
      rotation-y={1.5}
      position={[15, 0, 3]}
    >
      <planeBufferGeometry attach="geometry" args={[15, 15, 32, 32]} />
    </mesh>
  )
}

export default Object_3
