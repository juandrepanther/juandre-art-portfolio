import React, { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

import vertexShader from './shader1.vert'
import fragmentShader from './shader1.frag'

function Object_2() {
  // variables for the Leva debugger
  const { frequency_x, frequency_y, wireframe, intensity } = useControls({
    frequency_x: 1,
    frequency_y: 1,
    intensity: { value: 0.1, step: 0.5, max: 20, min: 0.1 },
    wireframe: false
  })

  // uniforms values

  const uniforms = {
    uTime: { value: 0 },
    uFrequency: { value: new THREE.Vector2(frequency_x, frequency_y) },
    uIntensity: { value: intensity }
  }

  // references
  const mesh_material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: 2,
    wireframe: wireframe,
    uniforms: uniforms
  })

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    // sending elapsed time to the material uniform and retrieve it in the vertex shader
    mesh_material.uniforms.uTime.value = time
    // animated rotation
  })

  return (
    <mesh material={mesh_material} position={[-20, 0, 17]}>
      <sphereBufferGeometry attach="geometry" args={[7, 7, 32, 32]} />
    </mesh>
  )
}

export default Object_2
