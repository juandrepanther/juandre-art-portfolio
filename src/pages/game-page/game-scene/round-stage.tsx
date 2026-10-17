import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import {
  CapsuleCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody
} from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { Group } from 'three'
import { Vector3 } from 'three'
import VikingAvatar from '../viking-avatar'
import { AxeProjectiles, HeartPickups, VikingTroop } from './actors'
import {
  createHeartState,
  createMonkeyState,
  createProjectileState,
  createRandomHeartPosition,
  resetControlsState,
  resetProjectileState,
  spawnProjectileIntoPool,
  syncControlsState,
  isPointInsideTreeTrunk
} from './helpers'
import {
  createInitialPlayerPosition,
  resetCameraState,
  syncCameraState,
  updateCameraFollowPosition
} from './camera'
import {
  AtmosphereDome,
  AtmosphereParticles,
  CinematicLights
} from './lighting'
import { GameSceneInstructions } from './overlay'
import { ArenaBounds, CrateField, TreeCluster } from './world'
import {
  DIFFICULTY_CONFIGS,
  GAME_FOG_FAR,
  GAME_FOG_NEAR,
  GAME_GROUND_SIZE,
  HEART_HEAL,
  HEART_RESPAWN_SECONDS,
  MAX_HEALTH,
  MONKEY_DAMAGE,
  MONKEY_RESPAWN_SECONDS,
  PLAYER_AXE_SPEED,
  PLAYER_START_POSITION,
  PROJECTILE_LIFETIME_SECONDS,
  createRandomBoxLayouts,
  createRandomTreeLayouts,
  type IGameSceneProps
} from '../helpers'
import {
  applyMonkeyTravelByDifficulty,
  resetMonkeyForDifficulty,
  updatePlayerFacing,
  updatePlayerMovement
} from './movement'
import {
  HEART_PICKUP_RADIUS,
  MONKEY_AIM_PRECISION,
  MONKEY_HIT_RADIUS,
  MONKEY_HITBOX_OFFSET,
  PLAYER_BODY_GROUND_OFFSET,
  PLAYER_COLLIDER_HALF_HEIGHT,
  PLAYER_COLLISION_RADIUS,
  PLAYER_HIT_FLASH_DURATION_MS,
  PLAYER_HIT_RADIUS,
  PLAYER_HITBOX_OFFSET,
  PLAYER_JUMP_VELOCITY,
  POINTER_LOCK_MAX_POLAR_ANGLE,
  POINTER_LOCK_MIN_POLAR_ANGLE,
  POINTER_LOCK_SELECTOR,
  POINTER_LOCK_SPEED,
  PROJECTILE_POOL_SIZE,
  type TGameControl
} from '../settings'
import { isPointInsideAnyCrate } from '../world-collision'

export default function RoundStage({
  difficulty,
  isActive,
  onHealthChange,
  onMonkeyHit,
  roundKey
}: IGameSceneProps) {
  const { camera, clock, gl } = useThree()
  const [subscribeToKeyboard, getKeyboardState] =
    useKeyboardControls<TGameControl>()
  const [isPlayerHitFlashing, setIsPlayerHitFlashing] = useState(false)
  const [treeLayouts] = useState(() => createRandomTreeLayouts())
  const [crateLayouts] = useState(() => createRandomBoxLayouts(treeLayouts))
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty]
  const playerBodyRef = useRef<RapierRigidBody | null>(null)
  const playerRef = useRef<Group | null>(null)
  const controlsRef = useRef({
    backward: false,
    forward: false,
    left: false,
    right: false
  })
  const playerPositionRef = useRef(createInitialPlayerPosition())
  const playerVelocityRef = useRef(new Vector3())
  const playerDirectionRef = useRef(new Vector3(0, 0, -1))
  const desiredFacingRef = useRef(new Vector3(0, 0, -1))
  const projectilesRef = useRef(
    Array.from({ length: PROJECTILE_POOL_SIZE }, createProjectileState)
  )
  const monkeyStateRef = useRef(createMonkeyState(treeLayouts))
  const heartStateRef = useRef(createHeartState(crateLayouts, treeLayouts))
  const healthRef = useRef(MAX_HEALTH)
  const lastDamageAtRef = useRef(-10)
  const onHealthChangeRef = useRef(onHealthChange)
  const onMonkeyHitRef = useRef(onMonkeyHit)
  const pendingPointerShotRef = useRef(false)
  const shootPlayerProjectileRef = useRef<() => void>(() => {})
  const isPointerLockedRef = useRef(false)
  const cameraLookDirectionRef = useRef(new Vector3(0, 0, -1))
  const cameraForwardRef = useRef(new Vector3(0, 0, -1))
  const cameraRightRef = useRef(new Vector3(1, 0, 0))
  const hitFlashTimeoutRef = useRef<number | null>(null)

  const setHealth = (health: number) => {
    healthRef.current = health
    onHealthChangeRef.current(health)
  }

  const triggerPlayerHitFlash = () => {
    setIsPlayerHitFlashing(true)

    if (hitFlashTimeoutRef.current !== null) {
      window.clearTimeout(hitFlashTimeoutRef.current)
    }

    hitFlashTimeoutRef.current = window.setTimeout(() => {
      setIsPlayerHitFlashing(false)
      hitFlashTimeoutRef.current = null
    }, PLAYER_HIT_FLASH_DURATION_MS)
  }

  const triggerPlayerJump = useEffectEvent(() => {
    const playerBody = playerBodyRef.current

    if (!isActive || !playerBody) {
      return
    }

    const currentVelocity = playerBody.linvel()

    if (Math.abs(currentVelocity.y) > 0.1) {
      return
    }

    playerBody.setLinvel(
      {
        x: currentVelocity.x,
        y: PLAYER_JUMP_VELOCITY,
        z: currentVelocity.z
      },
      true
    )
  })

  useEffect(() => {
    onHealthChangeRef.current = onHealthChange
  }, [onHealthChange])

  useEffect(() => {
    onMonkeyHitRef.current = onMonkeyHit
  }, [onMonkeyHit])

  useEffect(() => {
    return () => {
      if (hitFlashTimeoutRef.current !== null) {
        window.clearTimeout(hitFlashTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    shootPlayerProjectileRef.current = () => {
      if (!isActive) {
        return
      }

      const origin = playerPositionRef.current
        .clone()
        .add(new Vector3(0, 1.35, 0))
      const velocity = cameraLookDirectionRef.current
        .clone()
        .multiplyScalar(PLAYER_AXE_SPEED)

      spawnProjectileIntoPool(
        projectilesRef.current,
        origin,
        velocity,
        'player',
        PROJECTILE_LIFETIME_SECONDS
      )
    }
  }, [isActive])

  const handlePointerLock = () => {
    isPointerLockedRef.current = true

    if (pendingPointerShotRef.current) {
      pendingPointerShotRef.current = false
      shootPlayerProjectileRef.current()
    }
  }

  const handlePointerUnlock = () => {
    isPointerLockedRef.current = false
    pendingPointerShotRef.current = false
  }

  useEffect(() => {
    const controls = controlsRef.current
    const keyboardState = getKeyboardState()

    syncControlsState(controls, keyboardState)

    const unsubscribeControls = subscribeToKeyboard((nextKeyboardState) => {
      syncControlsState(controls, nextKeyboardState)
    })
    const unsubscribeJump = subscribeToKeyboard(
      (nextKeyboardState) => nextKeyboardState.jump,
      (isPressed) => {
        if (isPressed) {
          triggerPlayerJump()
        }
      }
    )

    const handlePointerDown = (e: PointerEvent) => {
      switch (e.button) {
        case 0:
          if (isPointerLockedRef.current) {
            shootPlayerProjectileRef.current()
            return
          }

          if (e.target instanceof HTMLCanvasElement) {
            pendingPointerShotRef.current = isActive
          }
          return
        default:
          return
      }
    }

    const handleBlur = () => {
      resetControlsState(controls)
      pendingPointerShotRef.current = false
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('blur', handleBlur)

    return () => {
      unsubscribeControls()
      unsubscribeJump()
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('blur', handleBlur)
      resetControlsState(controls)
      pendingPointerShotRef.current = false
    }
  }, [getKeyboardState, isActive, subscribeToKeyboard])

  useEffect(() => {
    playerPositionRef.current.copy(createInitialPlayerPosition())
    playerVelocityRef.current.set(0, 0, 0)
    playerDirectionRef.current.set(0, 0, -1)
    desiredFacingRef.current.set(0, 0, -1)
    isPointerLockedRef.current = document.pointerLockElement === gl.domElement
    pendingPointerShotRef.current = false
    resetCameraState({
      camera,
      cameraForward: cameraForwardRef.current,
      cameraLookDirection: cameraLookDirectionRef.current,
      cameraRight: cameraRightRef.current,
      playerPosition: playerPositionRef.current
    })
    resetControlsState(controlsRef.current)
    monkeyStateRef.current = createMonkeyState(treeLayouts)
    heartStateRef.current = createHeartState(crateLayouts, treeLayouts)

    playerBodyRef.current?.setTranslation(
      {
        x: PLAYER_START_POSITION[0],
        y: PLAYER_BODY_GROUND_OFFSET,
        z: PLAYER_START_POSITION[2]
      },
      true
    )
    playerBodyRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true)

    for (const projectile of projectilesRef.current) {
      resetProjectileState(projectile)
    }

    lastDamageAtRef.current = -10
    healthRef.current = MAX_HEALTH
    onHealthChangeRef.current(MAX_HEALTH)
  }, [camera, crateLayouts, difficulty, gl, roundKey, treeLayouts])

  useFrame((_, delta) => {
    const playerBody = playerBodyRef.current

    if (playerBody) {
      const playerTranslation = playerBody.translation()

      playerPositionRef.current.set(
        playerTranslation.x,
        playerTranslation.y,
        playerTranslation.z
      )
    }

    syncCameraState({
      camera,
      cameraForward: cameraForwardRef.current,
      cameraLookDirection: cameraLookDirectionRef.current,
      cameraRight: cameraRightRef.current
    })
    updateCameraFollowPosition(
      camera.position,
      playerPositionRef.current,
      cameraForwardRef.current,
      delta
    )

    if (!playerRef.current) {
      return
    }

    updatePlayerMovement({
      cameraForward: cameraForwardRef.current,
      cameraRight: cameraRightRef.current,
      controls: controlsRef.current,
      delta,
      playerVelocity: playerVelocityRef.current
    })
    updatePlayerFacing(
      desiredFacingRef.current,
      playerDirectionRef.current,
      cameraForwardRef.current,
      delta
    )

    if (playerBody) {
      const currentVelocity = playerBody.linvel()

      playerBody.setLinvel(
        {
          x: isActive ? playerVelocityRef.current.x : 0,
          y: currentVelocity.y,
          z: isActive ? playerVelocityRef.current.z : 0
        },
        true
      )

      const nextPlayerTranslation = playerBody.translation()

      playerPositionRef.current.set(
        nextPlayerTranslation.x,
        nextPlayerTranslation.y,
        nextPlayerTranslation.z
      )
    }

    playerRef.current.rotation.y = Math.atan2(
      playerDirectionRef.current.x,
      playerDirectionRef.current.z
    )

    if (!isActive) {
      return
    }

    const now = clock.elapsedTime
    const playerHitboxCenter = playerPositionRef.current
      .clone()
      .add(PLAYER_HITBOX_OFFSET)

    for (const monkeyState of monkeyStateRef.current) {
      applyMonkeyTravelByDifficulty(monkeyState, difficulty, delta)
      monkeyState.rotationY = Math.atan2(
        playerPositionRef.current.x - monkeyState.position.x,
        playerPositionRef.current.z - monkeyState.position.z
      )

      if (!monkeyState.active) {
        if (now >= monkeyState.respawnAt) {
          resetMonkeyForDifficulty(monkeyState, difficulty, now + 1.1)
        }

        continue
      }

      if (now >= monkeyState.nextThrowAt) {
        const origin = monkeyState.position.clone().add(new Vector3(0, 0.15, 0))
        const target = playerHitboxCenter.clone()
        const distanceToPlayer =
          monkeyState.position.distanceTo(playerHitboxCenter)
        const precisionOffset = distanceToPlayer * MONKEY_AIM_PRECISION

        target.x += (Math.random() - 0.5) * precisionOffset * 2
        target.z += (Math.random() - 0.5) * precisionOffset * 2

        spawnProjectileIntoPool(
          projectilesRef.current,
          origin,
          target
            .sub(origin)
            .normalize()
            .multiplyScalar(difficultyConfig.axeSpeed),
          'monkey',
          PROJECTILE_LIFETIME_SECONDS
        )

        monkeyState.nextThrowAt = now + difficultyConfig.monkeyThrowInterval
      }
    }

    for (const projectile of projectilesRef.current) {
      if (!projectile.active) {
        continue
      }

      projectile.position.addScaledVector(projectile.velocity, delta)
      projectile.ttl -= delta

      if (projectile.ttl <= 0) {
        projectile.active = false
        continue
      }

      if (
        isPointInsideAnyCrate(
          [projectile.position.x, projectile.position.y, projectile.position.z],
          crateLayouts
        ) ||
        isPointInsideTreeTrunk(projectile.position, treeLayouts)
      ) {
        projectile.active = false
        continue
      }

      switch (projectile.owner) {
        case 'player': {
          const hitMonkey = monkeyStateRef.current.find((monkeyState) => {
            if (!monkeyState.active) {
              return false
            }

            const monkeyHitboxCenter = monkeyState.position
              .clone()
              .add(MONKEY_HITBOX_OFFSET)

            return (
              monkeyHitboxCenter.distanceTo(projectile.position) <=
              MONKEY_HIT_RADIUS
            )
          })

          if (hitMonkey) {
            hitMonkey.active = false
            hitMonkey.respawnAt = now + MONKEY_RESPAWN_SECONDS
            projectile.active = false
            onMonkeyHitRef.current()
          }

          continue
        }
        default:
          if (
            playerHitboxCenter.distanceTo(projectile.position) <=
              PLAYER_HIT_RADIUS &&
            now - lastDamageAtRef.current > 0.3
          ) {
            lastDamageAtRef.current = now
            projectile.active = false
            triggerPlayerHitFlash()
            setHealth(Math.max(0, healthRef.current - MONKEY_DAMAGE))
          }
          continue
      }
    }

    for (const heartState of heartStateRef.current) {
      if (!heartState.active) {
        if (now >= heartState.respawnAt) {
          heartState.active = true
          heartState.position.copy(
            createRandomHeartPosition(crateLayouts, treeLayouts)
          )
        }

        continue
      }

      if (
        playerPositionRef.current.distanceTo(heartState.position) <=
        HEART_PICKUP_RADIUS
      ) {
        heartState.active = false
        heartState.respawnAt = now + HEART_RESPAWN_SECONDS
        setHealth(Math.min(MAX_HEALTH, healthRef.current + HEART_HEAL))
      }
    }
  })

  return (
    <>
      <color args={['#d8efe8']} attach="background" />
      <fog args={['#d8efe8', GAME_FOG_NEAR, GAME_FOG_FAR]} attach="fog" />

      <ArenaBounds />
      <AtmosphereDome />
      <AtmosphereParticles />

      <ambientLight intensity={0.45} />
      <hemisphereLight color="#fff8ea" groundColor="#9eb9af" intensity={1.1} />
      <CinematicLights />
      <directionalLight
        castShadow
        intensity={1.45}
        position={[7, 14, 5]}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
      />
      <spotLight
        angle={0.42}
        castShadow
        intensity={42}
        penumbra={0.8}
        position={[-9, 16, 12]}
      />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GAME_GROUND_SIZE, GAME_GROUND_SIZE]} />
        <meshStandardMaterial color="#c6e2cf" roughness={0.94} />
      </mesh>
      <CuboidCollider
        args={[GAME_GROUND_SIZE / 2, 0.1, GAME_GROUND_SIZE / 2]}
        position={[0, -0.1, 0]}
      />

      <mesh
        position={[0, 0.05, 0]}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[8.5, 10.5, 64]} />
        <meshStandardMaterial color="#dff4d6" roughness={1} />
      </mesh>

      <TreeCluster treeLayouts={treeLayouts} />
      <CrateField crateLayouts={crateLayouts} />
      <HeartPickups heartStateRef={heartStateRef} treeLayouts={treeLayouts} />
      <VikingTroop monkeyStateRef={monkeyStateRef} treeLayouts={treeLayouts} />
      <AxeProjectiles projectilesRef={projectilesRef} />
      <RigidBody
        canSleep={false}
        colliders={false}
        lockRotations
        position={[
          PLAYER_START_POSITION[0],
          PLAYER_BODY_GROUND_OFFSET,
          PLAYER_START_POSITION[2]
        ]}
        ref={playerBodyRef}
        type="dynamic"
      >
        <CapsuleCollider
          args={[PLAYER_COLLIDER_HALF_HEIGHT, PLAYER_COLLISION_RADIUS]}
          friction={0.8}
        />
        <Suspense fallback={null}>
          <VikingAvatar
            groundOffset={PLAYER_BODY_GROUND_OFFSET}
            isHitFlashing={isPlayerHitFlashing}
            playerRef={playerRef}
          />
        </Suspense>
      </RigidBody>

      <GameSceneInstructions key={roundKey} />

      <PointerLockControls
        makeDefault
        maxPolarAngle={POINTER_LOCK_MAX_POLAR_ANGLE}
        minPolarAngle={POINTER_LOCK_MIN_POLAR_ANGLE}
        onLock={handlePointerLock}
        onUnlock={handlePointerUnlock}
        pointerSpeed={POINTER_LOCK_SPEED}
        selector={POINTER_LOCK_SELECTOR}
      />
    </>
  )
}
