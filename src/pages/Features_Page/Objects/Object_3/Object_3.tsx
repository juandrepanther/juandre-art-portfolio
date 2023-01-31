import React from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'

import vertexShader from './shader1.vert'
import fragmentShader from './shader1.frag'
import { cameraTargetsTypes } from '../../../../types'

function Object_3({ object_3 }: Pick<cameraTargetsTypes, 'object_3'>) {
  // variables for the Leva debugger
  const {
    axis_x,
    axis_y,
    tone: { x, y, z }
  } = useControls('Object_3', {
    axis_x: { value: 0.5, step: 0.1, min: 0.0, max: 1.0 },
    axis_y: { value: 0.5, step: 0.1, min: 0.0, max: 1.0 },
    tone: {
      value: { x: 0.41, y: 0.86, z: 1.0 },
      step: 0.005,
      min: 0.0,
      max: 1.0
    }
  })

  // uniforms values

  const uniforms = {
    uTime: { value: 0 },
    uAxis: { value: new THREE.Vector2(axis_x, axis_y) },
    uTone: { value: new THREE.Vector3(x, y, z) }
  }

  // references
  const mesh_material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: 2,
    uniforms: uniforms,
    wireframe: false
  })

  const onHoverHandler = (e: { spaceX: number; spaceY: number }) => {
    //getting the mesh coordinates in the 3D space
    const coordinates = new THREE.Vector2(e.spaceX, e.spaceY)

    //normalizing the coordinates
    coordinates.x = (coordinates.x + 1) / 2
    coordinates.y = -(coordinates.y - 1) / 2

    // changing the uniforms
    uniforms.uAxis.value = new THREE.Vector2(coordinates.x, coordinates.y)
  }

  return (
    <mesh
      onPointerMove={onHoverHandler}
      material={mesh_material}
      rotation-y={1.5}
      position={object_3}
    >
      <planeBufferGeometry attach="geometry" args={[15, 15, 1, 1]} />
    </mesh>
  )
}

export default Object_3
