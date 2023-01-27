import { useGLTF } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { GLTFResult } from '../../types'

//! Always when model changes, use this converter with types ticked option: https://gltf.pmnd.rs/
//! Be aware, that you will be required to add correct refs, groups and RigidBodies

function Maze_Model() {
  const model_material = new THREE.MeshStandardMaterial()
  const maze_variant = useRef(1)
  const mazeVariant_timer = 15000
  const yAxis_distance = 0.65

  const yAxis_2_Up = useRef(0)
  const yAxis_2_Down = useRef(0)
  const yAxis_3_Up = useRef(0)
  const yAxis_3_Down = useRef(0)

  const Up_2_Meshes = useRef<any>()
  const Down_2_Meshes = useRef<any>()
  const Up_3_Meshes = useRef<any>()
  const Down_3_Meshes = useRef<any>()

  const { nodes } = useGLTF(
    `${
      process.env.NODE_ENV !== 'development'
        ? '/juandre-art-portfolio/models/Maze_full.glb'
        : '/models/Maze_full.glb'
    }`
  ) as GLTFResult

  // CUSTOM ANIMATIONS SETUP

  useEffect(() => {
    const interval = setInterval(() => {
      if (maze_variant.current > 0) {
        maze_variant.current += 1
      }
      if (maze_variant.current > 3) maze_variant.current = 1
    }, mazeVariant_timer)

    return () => clearInterval(interval)
  }, [])

  // conditions for the moving are in the useFrame hook

  useFrame(() => {
    const moving_2_Up = new THREE.Quaternion()
    const moving_2_Down = new THREE.Quaternion()
    const moving_3_Up = new THREE.Quaternion()
    const moving_3_Down = new THREE.Quaternion()

    if (maze_variant.current === 2) {
      //trigger 2_UP_MESHES
      if (yAxis_2_Up.current < yAxis_distance) {
        yAxis_2_Up.current += 0.01
        moving_2_Up.setFromEuler(new THREE.Euler(0, yAxis_2_Up.current, 0)) // transition up to 0.65
        Up_2_Meshes.current.setNextKinematicTranslation(moving_2_Up)
      }
      //trigger 2_Down_Meshes

      if (yAxis_2_Down.current > -yAxis_distance) {
        yAxis_2_Down.current -= 0.01
        moving_2_Down.setFromEuler(new THREE.Euler(0, yAxis_2_Down.current, 0)) // transition up to 0.65
        Down_2_Meshes.current.setNextKinematicTranslation(moving_2_Down)
      }
    }

    if (maze_variant.current === 3) {
      // trigger 2_UP_Meshes to initial position
      if (yAxis_2_Up.current > 0) {
        yAxis_2_Up.current -= 0.01
        moving_2_Up.setFromEuler(new THREE.Euler(0, yAxis_2_Up.current, 0))
        Up_2_Meshes.current.setNextKinematicTranslation(moving_2_Up)
      }
      // trigger 2_Down_Meshes to initial position
      if (yAxis_2_Down.current < 0) {
        yAxis_2_Down.current += 0.01
        moving_2_Down.setFromEuler(new THREE.Euler(0, yAxis_2_Down.current, 0)) // transition up to 0.65
        Down_2_Meshes.current.setNextKinematicTranslation(moving_2_Down)
      }
      // trigger 3_Up_Meshes
      if (yAxis_3_Up.current < yAxis_distance) {
        yAxis_3_Up.current += 0.01
        moving_3_Up.setFromEuler(new THREE.Euler(0, yAxis_3_Up.current, 0)) // transition up to 0.65
        Up_3_Meshes.current.setNextKinematicTranslation(moving_3_Up)
      }
      // trigger 3_Down_Meshes
      if (yAxis_3_Down.current > -yAxis_distance) {
        yAxis_3_Down.current -= 0.01
        moving_3_Down.setFromEuler(new THREE.Euler(0, yAxis_3_Down.current, 0)) // transition up to 0.65
        Down_3_Meshes.current.setNextKinematicTranslation(moving_3_Down)
      }
    }
    if (maze_variant.current === 1) {
      // trigger 3_UP_Meshes to initial position
      if (yAxis_3_Up.current > 0) {
        yAxis_3_Up.current -= 0.01
        moving_3_Up.setFromEuler(new THREE.Euler(0, yAxis_3_Up.current, 0))
        Up_3_Meshes.current.setNextKinematicTranslation(moving_3_Up)
      }
      // trigger 3_Down_Meshes to initial position
      if (yAxis_3_Down.current < 0) {
        yAxis_3_Down.current += 0.01
        moving_3_Down.setFromEuler(new THREE.Euler(0, yAxis_3_Down.current, 0)) // transition up to 0.65
        Down_3_Meshes.current.setNextKinematicTranslation(moving_3_Down)
      }
    }
  })

  /**
 * For stopping the animation at the end of the frame, use in the useFrame hook
      actions[names[1] as string].clampWhenFinished = true
      actions[names[1] as string].repetitions = 1
 */

  // names.map((name) => actions[name as string].play())

  return (
    <>
      <group dispose={null}>
        <group>
          <RigidBody
            type="kinematicPosition"
            colliders="cuboid"
            ref={Up_2_Meshes}
          >
            <mesh
              name="2_Up_1"
              castShadow
              receiveShadow
              geometry={nodes['2_Up_1'].geometry}
              material={model_material}
              position={[2.15, -0.21, -6.6]}
              rotation={[0, Math.PI / 2, 0]}
              scale={73.49}
            />
            <mesh
              name="2_Up_2"
              castShadow
              receiveShadow
              geometry={nodes['2_Up_2'].geometry}
              material={model_material}
              position={[0.29, -0.21, -3.48]}
              scale={73.49}
            />
            <mesh
              name="2_Up_3"
              castShadow
              receiveShadow
              geometry={nodes['2_Up_3'].geometry}
              material={model_material}
              position={[3.81, -0.21, -7.64]}
              rotation={[0, Math.PI / 2, 0]}
              scale={73.49}
            />
          </RigidBody>
        </group>
        <group>
          <RigidBody
            ref={Down_2_Meshes}
            type="kinematicPosition"
            colliders="cuboid"
          >
            <mesh
              name="2_Down_1"
              castShadow
              receiveShadow
              geometry={nodes['2_Down_1'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
            <mesh
              name="2_Down_2"
              castShadow
              receiveShadow
              geometry={nodes['2_Down_2'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
            <mesh
              name="2_Down_3"
              castShadow
              receiveShadow
              geometry={nodes['2_Down_3'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
          </RigidBody>
        </group>
        <group>
          <RigidBody
            ref={Up_3_Meshes}
            type="kinematicPosition"
            colliders="cuboid"
          >
            <mesh
              name="3_Up_1"
              castShadow
              receiveShadow
              geometry={nodes['3_Up_1'].geometry}
              material={model_material}
              position={[0.16, -0.22, -9.27]}
              rotation={[0, Math.PI / 2, 0]}
              scale={73.49}
            />
            <mesh
              name="3_Up_2"
              castShadow
              receiveShadow
              geometry={nodes['3_Up_2'].geometry}
              material={model_material}
              position={[1.82, -0.22, -6.6]}
              rotation={[0, Math.PI / 2, 0]}
              scale={73.49}
            />
            <mesh
              name="3_Up_3"
              castShadow
              receiveShadow
              geometry={nodes['3_Up_3'].geometry}
              material={model_material}
              position={[-0.66, -0.22, -7.39]}
              scale={73.49}
            />
            <mesh
              name="3_Up_4"
              castShadow
              receiveShadow
              geometry={nodes['3_Up_4'].geometry}
              material={model_material}
              position={[2.64, -0.22, -5.8]}
              scale={73.49}
            />
          </RigidBody>
        </group>
        <group>
          <RigidBody
            ref={Down_3_Meshes}
            type="kinematicPosition"
            colliders="cuboid"
          >
            <mesh
              name="3_Down_1"
              castShadow
              receiveShadow
              geometry={nodes['3_Down_1'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
            <mesh
              name="3_Down_2"
              castShadow
              receiveShadow
              geometry={nodes['3_Down_2'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
            <mesh
              name="3_Down_3"
              castShadow
              receiveShadow
              geometry={nodes['3_Down_3'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
            <mesh
              name="3_Down_4"
              castShadow
              receiveShadow
              geometry={nodes['3_Down_4'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
            <mesh
              name="3_Down_5"
              castShadow
              receiveShadow
              geometry={nodes['3_Down_5'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
            <mesh
              name="3_Down_6"
              castShadow
              receiveShadow
              geometry={nodes['3_Down_6'].geometry}
              material={model_material}
              position={[-5.23, 0, -10.12]}
              scale={73.49}
            />
          </RigidBody>
        </group>
        <RigidBody colliders="trimesh" type="fixed">
          <mesh
            name="Main"
            castShadow
            receiveShadow
            geometry={nodes.Main.geometry}
            material={model_material}
            position={[-5.23, 0, -10.12]}
            scale={73.49}
          />
        </RigidBody>
      </group>
    </>
  )
}

export default Maze_Model
