import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import {
  CapsuleCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody
} from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useEffectEvent, useRef, useState } from 'react'
import type { DirectionalLight, Group, SpotLight } from 'three'
import { Vector3 } from 'three'
import VikingAvatar from '../viking-avatar'
import { AxeProjectiles } from './actors/axe-projectiles'
import { Enemy } from './actors/enemy'
import { EnemyExplosionParticles } from './actors/enemy-explosion-particles'
import { PainkillerPickups } from './actors/painkiller-pickups'
import {
  createEnemyState,
  createEnemyExplosionParticleState,
  createPainkillerState,
  createProjectileState,
  createRandomPainkillerPosition,
  resetControlsState,
  resetEnemyExplosionParticleState,
  resetProjectileState,
  spawnProjectileIntoPool,
  spawnEnemyExplosionParticles,
  syncControlsState,
  isPointInsideTreeTrunk
} from './helpers'
import {
  createInitialPlayerPosition,
  resetCameraState,
  syncCameraState,
  updateCameraFollowPosition
} from './camera'
import { AtmosphereParticles, StormLightning } from './lighting'
import { GameSceneInstructions } from './overlay'
import { ArenaBounds } from './world-objects/arena-bounds'
import { CrateField } from './world-objects/crate-field'
import { TreeCluster } from './world-objects/tree-cluster'
import {
  GAME_GROUND_SIZE,
  MAX_HEALTH,
  PAINKILLER_HEAL,
  ENEMY_RESPAWN_SECONDS,
  PAINKILLER_RESPAWN_SECONDS,
  PLAYER_START_POSITION,
  PROJECTILE_LIFETIME_SECONDS,
  createRandomBoxLayouts,
  createRandomTreeLayouts,
  type IGameSceneProps
} from '../helpers'
import {
  applyEnemyTravelByDifficulty,
  resetEnemyForDifficulty,
  updatePlayerFacing,
  updatePlayerMovement
} from './movement'
import {
  ENEMY_AIM_PRECISION,
  ENEMY_HIT_RADIUS,
  ENEMY_HITBOX_OFFSET,
  ENEMY_EXPLOSION_PARTICLE_POOL_SIZE,
  PAINKILLER_PICKUP_RADIUS,
  PLAYER_BODY_GROUND_OFFSET,
  PLAYER_AXE_SPEED,
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
  DIRECTIONAL_LIGHT_BASE_COLOR,
  DIRECTIONAL_LIGHT_BASE_INTENSITY,
  DIRECTIONAL_LIGHT_POSITION,
  DIRECTIONAL_LIGHT_SHADOW_BIAS,
  DIRECTIONAL_LIGHT_SHADOW_CAMERA_BOUNDS,
  DIRECTIONAL_LIGHT_SHADOW_CAMERA_FAR,
  DIRECTIONAL_LIGHT_SHADOW_MAP_SIZE,
  DIRECTIONAL_LIGHT_SHADOW_NORMAL_BIAS,
  type TGameControl
} from '../settings'
import { isPointInsideAnyCrate } from '../world-collision'

export default function RoundStage({
  difficultyConfig,
  difficulty,
  isActive,
  onHealthChange,
  onEnemyHit,
  roundKey
}: IGameSceneProps) {
  const { camera, clock, gl } = useThree()
  const [subscribeToKeyboard, getKeyboardState] =
    useKeyboardControls<TGameControl>()
  const [isPlayerHitFlashing, setIsPlayerHitFlashing] = useState(false)
  const [treeLayouts] = useState(() => createRandomTreeLayouts())
  const [crateLayouts] = useState(() => createRandomBoxLayouts(treeLayouts))
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
  const enemyStateRef = useRef(
    createEnemyState(difficultyConfig.enemyCount, crateLayouts, treeLayouts)
  )
  const enemyExplosionParticleStateRef = useRef(
    Array.from({ length: ENEMY_EXPLOSION_PARTICLE_POOL_SIZE }, () =>
      createEnemyExplosionParticleState()
    )
  )
  const painkillerStateRef = useRef(
    createPainkillerState(crateLayouts, treeLayouts)
  )
  const healthRef = useRef(MAX_HEALTH)
  const lastDamageAtRef = useRef(-10)
  const onHealthChangeRef = useRef(onHealthChange)
  const onEnemyHitRef = useRef(onEnemyHit)
  const pendingPointerShotRef = useRef(false)
  const shootPlayerProjectileRef = useRef<() => void>(() => {})
  const isPointerLockedRef = useRef(false)
  const cameraLookDirectionRef = useRef(new Vector3(0, 0, -1))
  const cameraForwardRef = useRef(new Vector3(0, 0, -1))
  const cameraRightRef = useRef(new Vector3(1, 0, 0))
  const hitFlashTimeoutRef = useRef<number | null>(null)
  const directionalLightRef = useRef<DirectionalLight | null>(null)
  const spotlightRef = useRef<SpotLight | null>(null)

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
    onEnemyHitRef.current = onEnemyHit
  }, [onEnemyHit])

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
    enemyStateRef.current = createEnemyState(
      difficultyConfig.enemyCount,
      crateLayouts,
      treeLayouts
    )
    for (const particleState of enemyExplosionParticleStateRef.current) {
      resetEnemyExplosionParticleState(particleState)
    }
    painkillerStateRef.current = createPainkillerState(
      crateLayouts,
      treeLayouts
    )

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
  }, [
    camera,
    crateLayouts,
    difficultyConfig.enemyCount,
    difficulty,
    gl,
    roundKey,
    treeLayouts
  ])

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

    for (const enemyState of enemyStateRef.current) {
      if (!enemyState.active) {
        if (difficulty !== 'Noob' && now >= enemyState.respawnAt) {
          resetEnemyForDifficulty(enemyState, difficulty, now + 1.1)
        }

        continue
      }

      applyEnemyTravelByDifficulty(
        enemyState,
        difficulty,
        difficultyConfig.enemyMovementSpeed,
        delta
      )
      enemyState.rotationY = Math.atan2(
        playerPositionRef.current.x - enemyState.position.x,
        playerPositionRef.current.z - enemyState.position.z
      )

      if (now >= enemyState.nextThrowAt) {
        const origin = enemyState.position.clone().add(new Vector3(0, 0.15, 0))
        const target = playerHitboxCenter.clone()
        const distanceToPlayer =
          enemyState.position.distanceTo(playerHitboxCenter)
        const precisionOffset = distanceToPlayer * ENEMY_AIM_PRECISION

        target.x += (Math.random() - 0.5) * precisionOffset * 2
        target.z += (Math.random() - 0.5) * precisionOffset * 2

        spawnProjectileIntoPool(
          projectilesRef.current,
          origin,
          target
            .sub(origin)
            .normalize()
            .multiplyScalar(difficultyConfig.enemyProjectileSpeed),
          'enemy',
          PROJECTILE_LIFETIME_SECONDS
        )

        enemyState.nextThrowAt = now + difficultyConfig.enemyThrowInterval
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
          const hitEnemy = enemyStateRef.current.find((enemyState) => {
            if (!enemyState.active) {
              return false
            }

            const enemyHitboxCenter = enemyState.position
              .clone()
              .add(ENEMY_HITBOX_OFFSET)

            return (
              enemyHitboxCenter.distanceTo(projectile.position) <=
              ENEMY_HIT_RADIUS
            )
          })

          if (hitEnemy) {
            spawnEnemyExplosionParticles(
              enemyExplosionParticleStateRef.current,
              hitEnemy.position.clone().add(ENEMY_HITBOX_OFFSET)
            )
            hitEnemy.active = false
            hitEnemy.respawnAt =
              difficulty === 'Noob'
                ? Number.POSITIVE_INFINITY
                : now + ENEMY_RESPAWN_SECONDS
            projectile.active = false
            onEnemyHitRef.current()
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
            setHealth(
              Math.max(0, healthRef.current - difficultyConfig.enemyDamage)
            )
          }
          continue
      }
    }

    for (const painkillerState of painkillerStateRef.current) {
      if (!painkillerState.active) {
        if (now >= painkillerState.respawnAt) {
          painkillerState.active = true
          painkillerState.position.copy(
            createRandomPainkillerPosition(crateLayouts, treeLayouts)
          )
        }

        continue
      }

      if (
        playerPositionRef.current.distanceTo(painkillerState.position) <=
        PAINKILLER_PICKUP_RADIUS
      ) {
        painkillerState.active = false
        painkillerState.respawnAt = now + PAINKILLER_RESPAWN_SECONDS
        setHealth(Math.min(MAX_HEALTH, healthRef.current + PAINKILLER_HEAL))
      }
    }
  })

  return (
    <>
      <ArenaBounds />
      <AtmosphereParticles />

      <mesh
        position={[0, -0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[GAME_GROUND_SIZE, GAME_GROUND_SIZE]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <StormLightning
        directionalLightRef={directionalLightRef}
        spotlightRef={spotlightRef}
      />
      <directionalLight
        castShadow
        color={DIRECTIONAL_LIGHT_BASE_COLOR}
        intensity={DIRECTIONAL_LIGHT_BASE_INTENSITY}
        position={DIRECTIONAL_LIGHT_POSITION}
        ref={directionalLightRef}
        shadow-bias={DIRECTIONAL_LIGHT_SHADOW_BIAS}
        shadow-camera-bottom={-DIRECTIONAL_LIGHT_SHADOW_CAMERA_BOUNDS}
        shadow-camera-far={DIRECTIONAL_LIGHT_SHADOW_CAMERA_FAR}
        shadow-camera-left={-DIRECTIONAL_LIGHT_SHADOW_CAMERA_BOUNDS}
        shadow-camera-right={DIRECTIONAL_LIGHT_SHADOW_CAMERA_BOUNDS}
        shadow-camera-top={DIRECTIONAL_LIGHT_SHADOW_CAMERA_BOUNDS}
        shadow-mapSize-height={DIRECTIONAL_LIGHT_SHADOW_MAP_SIZE}
        shadow-mapSize-width={DIRECTIONAL_LIGHT_SHADOW_MAP_SIZE}
        shadow-normalBias={DIRECTIONAL_LIGHT_SHADOW_NORMAL_BIAS}
      />
      <CuboidCollider
        args={[GAME_GROUND_SIZE / 2, 0.1, GAME_GROUND_SIZE / 2]}
        position={[0, -0.1, 0]}
      />

      <TreeCluster treeLayouts={treeLayouts} />
      <CrateField crateLayouts={crateLayouts} />
      <Enemy
        enemyCount={difficultyConfig.enemyCount}
        enemyStateRef={enemyStateRef}
      />
      <EnemyExplosionParticles
        particleStatesRef={enemyExplosionParticleStateRef}
      />
      <PainkillerPickups
        painkillerStateRef={painkillerStateRef}
        treeLayouts={treeLayouts}
      />
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
