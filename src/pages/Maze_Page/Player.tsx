import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import type { RigidBodyApi } from '@react-three/rapier'
import { isMobile } from 'react-device-detect'
import * as THREE from 'three'
import type { SpotLight } from 'three'
import useKeyPress from '../../utils/useKeyPress'
import useSwipe from '../../hooks/useSwipe'

function Player() {
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(2, 5, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
  const body = useRef<RigidBodyApi | null>(null)
  const spotLightRef = useRef<SpotLight | null>(null)
  const swipeDirection = useSwipe()
  const moveForward = useKeyPress('w')
  const moveForwardArrow = useKeyPress('ArrowUp')
  const moveForwardAzerty = useKeyPress('KeyW')
  const moveBack = useKeyPress('s')
  const moveBackArrow = useKeyPress('ArrowDown')
  const moveBackAzerty = useKeyPress('KeyS')
  const moveLeft = useKeyPress('a')
  const moveLeftArrow = useKeyPress('ArrowLeft')
  const moveLeftAzerty = useKeyPress('KeyA')
  const moveRight = useKeyPress('d')
  const moveRightArrow = useKeyPress('ArrowRight')
  const moveRightAzerty = useKeyPress('KeyD')
  const resetKeyPressed = useKeyPress('r')

  // reset to initial position function

  const reset_game = () => {
    if (!body.current) {
      return
    }

    const resetBall_position = new THREE.Quaternion()
    resetBall_position.setFromEuler(new THREE.Euler(0, 0.7, 0))
    body.current.setTranslation(resetBall_position)
    body.current.setLinvel({ x: 0, y: 0, z: 0 })
    body.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  // "cheater" function

  const cheater_trigger = () => {
    setTimeout(() => {
      reset_game()
    }, 1000)
  }

  // key handlers by using hook
  const forward = isMobile ? swipeDirection === 'up' : moveForward
  const forward_arrow = isMobile ? swipeDirection === 'up' : moveForwardArrow
  const forward_azerty = isMobile ? swipeDirection === 'up' : moveForwardAzerty

  const back = isMobile ? swipeDirection === 'down' : moveBack
  const back_arrow = isMobile ? swipeDirection === 'down' : moveBackArrow
  const back_azerty = isMobile ? swipeDirection === 'down' : moveBackAzerty

  const left = isMobile ? swipeDirection === 'left' : moveLeft
  const left_arrow = isMobile ? swipeDirection === 'left' : moveLeftArrow
  const left_azerty = isMobile ? swipeDirection === 'left' : moveLeftAzerty

  const right = isMobile ? swipeDirection === 'right' : moveRight
  const right_arrow = isMobile ? swipeDirection === 'right' : moveRightArrow
  const right_azerty = isMobile ? swipeDirection === 'right' : moveRightAzerty

  const reset_keyPressed = isMobile
    ? swipeDirection === 'reset'
    : resetKeyPressed

  useFrame((state, delta) => {
    if (!body.current || !spotLightRef.current) {
      return
    }

    //default impulse values
    let impulse = { x: 0, y: 0, z: 0 }
    let torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = (0.1 * delta) / 80
    const torqueStrength = (0.1 * delta) / 80

    if (forward || forward_arrow || forward_azerty) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (right || right_arrow || right_azerty) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    if (back || back_arrow || back_azerty) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (left || left_arrow || left_azerty) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)

    // camera settings

    const bodyPosition = body.current.translation()

    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 1.25
    cameraPosition.y += 0.65

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)

    // spotLight dynamic Move

    const spotLightPosition = new THREE.Vector3()
    spotLightPosition.copy(bodyPosition)
    spotLightPosition.y += 1.0

    const spotLightTarget = new THREE.Vector3()
    spotLightTarget.copy(bodyPosition)
    spotLightTarget.y += 0.25

    spotLightRef.current.position.copy(spotLightPosition)
    spotLightRef.current.target.position.copy(bodyPosition)

    // for light target updating the matrix
    spotLightRef.current.target.updateMatrixWorld()

    // fall ball callback
    if (bodyPosition.y < -3) return reset_game()

    // reset button
    if (reset_keyPressed) return reset_game()
  })

  // useHelper(spotLightRef, SpotLightHelper, '#fff')

  // HERE ARE ALSO INVISIBLE COLLIDERS FOR THE TRIGGERING FUNCTIONS
  return (
    <>
      <RigidBody colliders={false} type="fixed" position={[-0.37, 0, -10.2]}>
        <CuboidCollider
          args={[0.2, 0.2, 0.05]}
          sensor
          onIntersectionEnter={() => reset_game()}
        />
      </RigidBody>
      <group>
        <RigidBody colliders={false} type="fixed" position={[-5.65, 0, -4.2]}>
          <CuboidCollider
            args={[0.5, 0.2, 0.05]}
            sensor
            onIntersectionEnter={() => cheater_trigger()}
          />
        </RigidBody>
        <RigidBody colliders={false} type="fixed" position={[5.34, 0, -4.2]}>
          <CuboidCollider
            args={[0.5, 0.2, 0.05]}
            sensor
            onIntersectionEnter={() => cheater_trigger()}
          />
        </RigidBody>
      </group>
      <spotLight
        distance={10.4}
        angle={0.7}
        penumbra={1}
        castShadow
        shadow-mapSize={1024}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
        shadow-radius={10}
        shadow-bias={-0.0011}
        ref={spotLightRef}
        color="grey"
        intensity={3}
      />
      <RigidBody
        ref={body}
        colliders="ball"
        restitution={0.1}
        friction={0.1}
        linearDamping={0.5}
        angularDamping={0.5}
        position={[0, 0.7, 0]}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.1, 4]} />
          <meshStandardMaterial
            flatShading
            emissive={'white'}
            emissiveIntensity={5}
          />
        </mesh>
      </RigidBody>
    </>
  )
}

export default Player
