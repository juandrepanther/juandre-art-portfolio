import {
  Cloud,
  Clouds,
  PointerLockControls,
  useTexture,
  useKeyboardControls
} from '@react-three/drei'
import {
  CapsuleCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody
} from '@react-three/rapier'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useEffectEvent, useRef, useState } from 'react'
import groundTextureUrl from 'assets/images/bg_ground.jpg?url'
import type { DirectionalLight, Group, SpotLight } from 'three'
import { MeshBasicMaterial, RepeatWrapping, SRGBColorSpace, Vector3 } from 'three'
import CharacterModel from '../character-chooser/character-model'
import PlayerHealthMeter from './player-health-meter'
import { AxeProjectiles } from './actors/axe-projectiles'
import { Enemy } from './actors/enemy'
import { EnemyExplosionParticles } from './actors/enemy-explosion-particles'
import { ExplosionParticles } from './actors/explosion-particles'
import { FloatingCombatText } from './actors/floating-combat-text'
import { PainkillerPickups } from './actors/painkiller-pickups'
import { TntBoxes } from './actors/tnt-boxes'
import {
  createFloatingCombatTextState,
  createExplosionParticleState,
  createEnemyState,
  createEnemyExplosionParticleState,
  createPainkillerState,
  createProjectileState,
  createTntState,
  createRandomPainkillerPosition,
  resetControlsState,
  resetFloatingCombatTextState,
  resetEnemyExplosionParticleState,
  resetExplosionParticleState,
  resetProjectileState,
  spawnFloatingCombatText,
  spawnProjectileIntoPool,
  spawnExplosionParticles,
  spawnEnemyExplosionParticles,
  updateFloatingCombatTextStates,
  syncControlsState,
  doesProjectilePathHitObstacle
} from './helpers'
import {
  createInitialPlayerPosition,
  resetCameraState,
  syncCameraState,
  updateCameraFollowPosition,
  updateCameraOrbitPosition
} from './camera'
import { AtmosphereParticles, StormLightning } from './lighting'
import { canUseAirJumpNearApex } from './jump-helpers'
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
  MOBILE_TOUCH_LOOK_SENSITIVITY,
  PLAYER_AXE_SPEED,
  PLAYER_CAMERA_HEIGHT,
  POINTER_MAX_PITCH,
  POINTER_MIN_PITCH,
  PLAYER_COLLIDER_HALF_HEIGHT,
  PLAYER_COLLISION_RADIUS,
  PLAYER_HIT_FLASH_DURATION_MS,
  PLAYER_HIT_RADIUS,
  PLAYER_HITBOX_OFFSET,
  PLAYER_GROUNDED_VERTICAL_SPEED_EPSILON,
  PLAYER_JUMP_GRAVITY,
  PLAYER_MAX_JUMPS,
  PLAYER_SECOND_JUMP_APEX_ZONE_RATIO,
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
  TNT_BOX_DAMAGE,
  TNT_BOX_KNOCKBACK_FORCE,
  TNT_BOX_KNOCKBACK_UPWARD_FORCE,
  TNT_EXPLOSION_PARTICLE_COLOR,
  TNT_EXPLOSION_PARTICLE_EMISSIVE,
  TNT_EXPLOSION_PARTICLE_POOL_SIZE,
  TNT_EXPLOSION_PARTICLES_PER_BURST,
  FLOATING_COMBAT_TEXT_POOL_SIZE,
  type TGameControl
} from '../settings'
const playerRigidBodyName = 'player-body'
const cloudColors = ['orange', 'hotpink', 'skyblue', 'white', 'gold']

interface ICloudConfig {
  bounds: [number, number, number]
  color: string
  fade: number
  position: [number, number, number]
  scale: number
  seed: number
  segments: number
  volume: number
}

interface ILookDelta {
  x: number
  y: number
}

function getYawFromDirection(direction: Vector3) {
  return Math.atan2(direction.x, -direction.z)
}

function getPitchFromDirection(direction: Vector3) {
  return Math.asin(direction.y)
}

const createRandomCloudConfigs = (): ICloudConfig[] => {
  const cloudCount = Math.floor(Math.random() * 2) + 1

  return Array.from({ length: cloudCount }, () => ({
    bounds: [
      6 + Math.random() * 6,
      1.2 + Math.random() * 1.6,
      1.2 + Math.random() * 1.8
    ],
    color: cloudColors[Math.floor(Math.random() * cloudColors.length)],
    fade: 80 + Math.random() * 60,
    position: [
      -18 + Math.random() * 36,
      7 + Math.random() * 7,
      -18 + Math.random() * 36
    ],
    scale: 1.2 + Math.random() * 1.6,
    seed: Math.random() * 10_000,
    segments: Math.floor(20 + Math.random() * 21),
    volume: 4 + Math.random() * 6
  }))
}

export default function RoundStage({
  cameraHorizontalSnapKey = 0,
  characterConfig,
  difficultyConfig,
  difficulty,
  health,
  isActive,
  isDevelopmentMode = false,
  isCameraOrbiting,
  isLandscapeMobile,
  isMobileViewport,
  mobileJumpPressCount,
  mobileLookAccumulatorX,
  mobileLookAccumulatorY,
  mobileMoveVectorX,
  mobileMoveVectorY,
  mobileShootPressCount,
  showMobileControls,
  onHealthChange,
  onEnemyHit,
  onPlayerHitIndicator,
  playerName,
  roundKey,
  showHealthMeter
}: IGameSceneProps) {
  const { camera, clock, gl } = useThree()
  const groundTexture = useTexture(groundTextureUrl)
  const shouldRenderVisualEffects = !isMobileViewport
  const mapDirectionalLightIntensity = isMobileViewport
    ? DIRECTIONAL_LIGHT_BASE_INTENSITY * 2
    : DIRECTIONAL_LIGHT_BASE_INTENSITY
  const [subscribeToKeyboard, getKeyboardState] =
    useKeyboardControls<TGameControl>()
  const [isPlayerHitFlashing, setIsPlayerHitFlashing] = useState(false)
  const [treeLayouts] = useState(() => createRandomTreeLayouts())
  const [crateLayouts] = useState(() => createRandomBoxLayouts(treeLayouts))
  const [cloudConfigs] = useState(() => createRandomCloudConfigs())
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
  const tntExplosionParticleStateRef = useRef(
    Array.from({ length: TNT_EXPLOSION_PARTICLE_POOL_SIZE }, () =>
      createExplosionParticleState()
    )
  )
  const floatingCombatTextStateRef = useRef(
    Array.from({ length: FLOATING_COMBAT_TEXT_POOL_SIZE }, () =>
      createFloatingCombatTextState()
    )
  )
  const painkillerStateRef = useRef(
    createPainkillerState(crateLayouts, treeLayouts)
  )
  const tntBoxStateRef = useRef(createTntState(crateLayouts, treeLayouts))
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
  const mobileLookDeltaRef = useRef<ILookDelta>({ x: 0, y: 0 })
  const consumedLookAccumulatorRef = useRef({ x: 0, y: 0 })
  const consumedJumpCountRef = useRef(0)
  const consumedShootCountRef = useRef(0)
  const airborneJumpCountRef = useRef(0)
  const jumpStartYRef = useRef(PLAYER_BODY_GROUND_OFFSET)
  const cameraYawRef = useRef(0)
  const cameraPitchRef = useRef(0)
  const cameraUpRef = useRef(new Vector3(0, 1, 0))

  useEffect(() => {
    groundTexture.colorSpace = SRGBColorSpace
    groundTexture.wrapS = RepeatWrapping
    groundTexture.wrapT = RepeatWrapping
    groundTexture.repeat.set(8, 8)
    groundTexture.needsUpdate = true
  }, [groundTexture])

  const getPlayerHitDirection = (projectileVelocity: Vector3) => {
    const normalizedVelocity = projectileVelocity.clone()

    if (normalizedVelocity.lengthSq() <= 0.0001) {
      return null
    }

    normalizedVelocity.normalize()
    cameraUpRef.current
      .crossVectors(cameraRightRef.current, cameraLookDirectionRef.current)
      .normalize()

    const horizontalMagnitude = normalizedVelocity.dot(cameraRightRef.current)
    const verticalMagnitude = normalizedVelocity.dot(cameraUpRef.current)

    if (
      Math.abs(horizontalMagnitude) <= 0.05 &&
      Math.abs(verticalMagnitude) <= 0.05
    ) {
      return null
    }

    if (Math.abs(horizontalMagnitude) >= Math.abs(verticalMagnitude)) {
      return horizontalMagnitude >= 0 ? 'left' : 'right'
    }

    return verticalMagnitude >= 0 ? 'top' : 'bottom'
  }

  const setHealth = (health: number) => {
    healthRef.current = health
    onHealthChangeRef.current(health)
  }

  const spawnHealthDeltaText = (
    value: number,
    source: 'enemy' | 'painkiller' | 'tnt'
  ) => {
    spawnFloatingCombatText(floatingCombatTextStateRef.current, {
      source,
      value
    })
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
    const currentY = playerBody.translation().y
    const isGroundedByVerticalVelocity =
      Math.abs(currentVelocity.y) <= PLAYER_GROUNDED_VERTICAL_SPEED_EPSILON
    const canUseGroundJump =
      airborneJumpCountRef.current === 0 && isGroundedByVerticalVelocity

    if (canUseGroundJump) {
      jumpStartYRef.current = currentY
      airborneJumpCountRef.current = 1

      playerBody.setLinvel(
        {
          x: currentVelocity.x,
          y: PLAYER_JUMP_VELOCITY,
          z: currentVelocity.z
        },
        true
      )

      return
    }

    if (airborneJumpCountRef.current >= PLAYER_MAX_JUMPS) {
      return
    }

    const canUseSecondJump = canUseAirJumpNearApex({
      apexZoneRatio: PLAYER_SECOND_JUMP_APEX_ZONE_RATIO,
      currentY,
      gravity: PLAYER_JUMP_GRAVITY,
      jumpStartY: jumpStartYRef.current,
      jumpVelocity: PLAYER_JUMP_VELOCITY
    })

    if (!canUseSecondJump) {
      return
    }

    airborneJumpCountRef.current = PLAYER_MAX_JUMPS

    playerBody.setLinvel(
      {
        x: currentVelocity.x,
        y: PLAYER_JUMP_VELOCITY,
        z: currentVelocity.z
      },
      true
    )
  })

  const detonateTntBox = (tntIndex: number) => {
    if (!isActive) {
      return
    }

    const tntBoxState = tntBoxStateRef.current[tntIndex]
    const playerBody = playerBodyRef.current

    if (!tntBoxState?.active) {
      return
    }

    tntBoxState.active = false
    triggerPlayerHitFlash()
    if (shouldRenderVisualEffects) {
      spawnExplosionParticles(
        tntExplosionParticleStateRef.current,
        tntBoxState.position.clone(),
        TNT_EXPLOSION_PARTICLES_PER_BURST
      )
    }

    const tntDamage = isDevelopmentMode ? 0 : TNT_BOX_DAMAGE
    const nextHealth = Math.max(0, healthRef.current - tntDamage)
    const healthDelta = nextHealth - healthRef.current

    setHealth(nextHealth)
    spawnHealthDeltaText(healthDelta, 'tnt')

    if (playerBody) {
      const currentVelocity = playerBody.linvel()
      const angle = Math.random() * Math.PI * 2

      playerBody.setLinvel(
        {
          x: currentVelocity.x + Math.cos(angle) * TNT_BOX_KNOCKBACK_FORCE,
          y: Math.max(currentVelocity.y, TNT_BOX_KNOCKBACK_UPWARD_FORCE),
          z: currentVelocity.z + Math.sin(angle) * TNT_BOX_KNOCKBACK_FORCE
        },
        true
      )
    }
  }

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
        PROJECTILE_LIFETIME_SECONDS,
        characterConfig.weapon
      )
    }
  }, [characterConfig.weapon, isActive])

  useEffect(() => {
    if (!isCameraOrbiting) {
      return undefined
    }

    if (document.pointerLockElement !== gl.domElement) {
      return undefined
    }

    document.exitPointerLock()

    return undefined
  }, [gl, isCameraOrbiting])

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

    if (!isMobileViewport) {
      window.addEventListener('pointerdown', handlePointerDown)
    }
    window.addEventListener('blur', handleBlur)

    return () => {
      unsubscribeControls()
      unsubscribeJump()
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('blur', handleBlur)
      resetControlsState(controls)
      pendingPointerShotRef.current = false
    }
  }, [getKeyboardState, isActive, isMobileViewport, subscribeToKeyboard])

  useEffect(() => {
    playerPositionRef.current.copy(createInitialPlayerPosition())
    playerVelocityRef.current.set(0, 0, 0)
    playerDirectionRef.current.set(0, 0, -1)
    desiredFacingRef.current.set(0, 0, -1)
    airborneJumpCountRef.current = 0
    jumpStartYRef.current = PLAYER_BODY_GROUND_OFFSET
    isPointerLockedRef.current = document.pointerLockElement === gl.domElement
    pendingPointerShotRef.current = false
    resetCameraState({
      camera,
      cameraForward: cameraForwardRef.current,
      cameraLookDirection: cameraLookDirectionRef.current,
      cameraRight: cameraRightRef.current,
      playerPosition: playerPositionRef.current
    })
    cameraYawRef.current = getYawFromDirection(cameraLookDirectionRef.current)
    cameraPitchRef.current = getPitchFromDirection(
      cameraLookDirectionRef.current
    )
    mobileLookDeltaRef.current = { x: 0, y: 0 }
    consumedLookAccumulatorRef.current = { x: 0, y: 0 }
    resetControlsState(controlsRef.current)
    enemyStateRef.current = createEnemyState(
      difficultyConfig.enemyCount,
      crateLayouts,
      treeLayouts
    )
    for (const particleState of enemyExplosionParticleStateRef.current) {
      resetEnemyExplosionParticleState(particleState)
    }
    for (const particleState of tntExplosionParticleStateRef.current) {
      resetExplosionParticleState(particleState)
    }
    for (const floatingCombatTextState of floatingCombatTextStateRef.current) {
      resetFloatingCombatTextState(floatingCombatTextState)
    }
    painkillerStateRef.current = createPainkillerState(
      crateLayouts,
      treeLayouts
    )
    tntBoxStateRef.current = createTntState(crateLayouts, treeLayouts)

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

  useEffect(() => {
    const lookAccumulatorDiffX =
      mobileLookAccumulatorX - consumedLookAccumulatorRef.current.x
    const lookAccumulatorDiffY =
      mobileLookAccumulatorY - consumedLookAccumulatorRef.current.y

    consumedLookAccumulatorRef.current = {
      x: mobileLookAccumulatorX,
      y: mobileLookAccumulatorY
    }

    mobileLookDeltaRef.current.x += lookAccumulatorDiffX
    mobileLookDeltaRef.current.y += lookAccumulatorDiffY
  }, [mobileLookAccumulatorX, mobileLookAccumulatorY])

  useEffect(() => {
    if (
      !isLandscapeMobile ||
      mobileJumpPressCount <= consumedJumpCountRef.current
    ) {
      return
    }

    consumedJumpCountRef.current = mobileJumpPressCount
    triggerPlayerJump()
  }, [isLandscapeMobile, mobileJumpPressCount])

  useEffect(() => {
    if (
      !isActive ||
      !isLandscapeMobile ||
      mobileShootPressCount <= consumedShootCountRef.current
    ) {
      return
    }

    consumedShootCountRef.current = mobileShootPressCount
    shootPlayerProjectileRef.current()
  }, [isActive, isLandscapeMobile, mobileShootPressCount])

  useEffect(() => {
    if (cameraHorizontalSnapKey <= 0 || isCameraOrbiting) {
      return
    }

    const horizontalLookDirection = cameraLookDirectionRef.current.clone()
    horizontalLookDirection.y = 0

    if (horizontalLookDirection.lengthSq() <= 0.0001) {
      horizontalLookDirection.set(0, 0, -1)
    } else {
      horizontalLookDirection.normalize()
    }

    const horizontalLookTarget = playerPositionRef.current
      .clone()
      .add(new Vector3(0, PLAYER_CAMERA_HEIGHT, 0))
      .add(horizontalLookDirection.multiplyScalar(18))

    camera.lookAt(horizontalLookTarget)
    syncCameraState({
      camera,
      cameraForward: cameraForwardRef.current,
      cameraLookDirection: cameraLookDirectionRef.current,
      cameraRight: cameraRightRef.current
    })
    cameraYawRef.current = getYawFromDirection(cameraLookDirectionRef.current)
    cameraPitchRef.current = getPitchFromDirection(
      cameraLookDirectionRef.current
    )
  }, [camera, cameraHorizontalSnapKey, isCameraOrbiting])

  useFrame((_, delta) => {
    updateFloatingCombatTextStates(floatingCombatTextStateRef.current, delta)

    const playerBody = playerBodyRef.current

    if (playerBody) {
      const playerTranslation = playerBody.translation()

      playerPositionRef.current.set(
        playerTranslation.x,
        playerTranslation.y,
        playerTranslation.z
      )
    }

    if (isCameraOrbiting) {
      updateCameraOrbitPosition({
        camera,
        cameraForward: cameraForwardRef.current,
        cameraLookDirection: cameraLookDirectionRef.current,
        cameraRight: cameraRightRef.current,
        delta,
        elapsedTime: clock.elapsedTime,
        playerPosition: playerPositionRef.current
      })
    } else {
      if (isMobileViewport && isLandscapeMobile && showMobileControls) {
        const deltaLook = mobileLookDeltaRef.current

        if (deltaLook.x !== 0 || deltaLook.y !== 0) {
          cameraYawRef.current -= deltaLook.x * MOBILE_TOUCH_LOOK_SENSITIVITY
          cameraPitchRef.current = Math.max(
            POINTER_MIN_PITCH,
            Math.min(
              POINTER_MAX_PITCH,
              cameraPitchRef.current -
                deltaLook.y * MOBILE_TOUCH_LOOK_SENSITIVITY
            )
          )
          camera.rotation.set(
            cameraPitchRef.current,
            cameraYawRef.current,
            0,
            'YXZ'
          )
          mobileLookDeltaRef.current = { x: 0, y: 0 }
        }
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
    }

    if (!isActive) {
      return
    }

    if (!playerRef.current) {
      return
    }

    const mobileForward = mobileMoveVectorY < -0.28
    const mobileBackward = mobileMoveVectorY > 0.28
    const mobileLeft = mobileMoveVectorX < -0.28
    const mobileRight = mobileMoveVectorX > 0.28

    const mergedControls = {
      backward:
        controlsRef.current.backward ||
        (isMobileViewport &&
          isLandscapeMobile &&
          showMobileControls &&
          mobileBackward),
      forward:
        controlsRef.current.forward ||
        (isMobileViewport &&
          isLandscapeMobile &&
          showMobileControls &&
          mobileForward),
      left:
        controlsRef.current.left ||
        (isMobileViewport &&
          isLandscapeMobile &&
          showMobileControls &&
          mobileLeft),
      right:
        controlsRef.current.right ||
        (isMobileViewport &&
          isLandscapeMobile &&
          showMobileControls &&
          mobileRight)
    }

    updatePlayerMovement({
      cameraForward: cameraForwardRef.current,
      cameraRight: cameraRightRef.current,
      controls: mergedControls,
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
          x: playerVelocityRef.current.x,
          y: currentVelocity.y,
          z: playerVelocityRef.current.z
        },
        true
      )

      const nextPlayerTranslation = playerBody.translation()

      playerPositionRef.current.set(
        nextPlayerTranslation.x,
        nextPlayerTranslation.y,
        nextPlayerTranslation.z
      )

      const hasLandedSinceJump =
        airborneJumpCountRef.current > 0 &&
        Math.abs(currentVelocity.y) <= PLAYER_GROUNDED_VERTICAL_SPEED_EPSILON &&
        nextPlayerTranslation.y <= jumpStartYRef.current + 0.08

      if (hasLandedSinceJump) {
        airborneJumpCountRef.current = 0
        jumpStartYRef.current = nextPlayerTranslation.y
      }
    }

    playerRef.current.rotation.y = Math.atan2(
      playerDirectionRef.current.x,
      playerDirectionRef.current.z
    )

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
          PROJECTILE_LIFETIME_SECONDS,
          'axe'
        )

        enemyState.nextThrowAt = now + difficultyConfig.enemyThrowInterval
      }
    }

    for (const projectile of projectilesRef.current) {
      if (!projectile.active) {
        continue
      }

      const previousProjectilePosition = projectile.position.clone()

      projectile.position.addScaledVector(projectile.velocity, delta)
      projectile.ttl -= delta

      if (projectile.ttl <= 0) {
        projectile.active = false
        continue
      }

      if (
        doesProjectilePathHitObstacle({
          crateLayouts,
          nextPosition: projectile.position,
          previousPosition: previousProjectilePosition,
          treeLayouts
        })
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
            if (shouldRenderVisualEffects) {
              spawnEnemyExplosionParticles(
                enemyExplosionParticleStateRef.current,
                hitEnemy.position.clone().add(ENEMY_HITBOX_OFFSET)
              )
            }
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

            const nextHealth = Math.max(
              0,
              healthRef.current -
                (isDevelopmentMode ? 0 : difficultyConfig.enemyDamage)
            )
            const healthDelta = nextHealth - healthRef.current
            const hitDirection = getPlayerHitDirection(projectile.velocity)

            setHealth(nextHealth)
            spawnHealthDeltaText(healthDelta, 'enemy')

            if (hitDirection) {
              onPlayerHitIndicator?.(hitDirection)
            }
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

        const nextHealth = Math.min(
          MAX_HEALTH,
          healthRef.current + PAINKILLER_HEAL
        )
        const healthDelta = nextHealth - healthRef.current

        setHealth(nextHealth)
        spawnHealthDeltaText(healthDelta, 'painkiller')
      }
    }
  })

  return (
    <>
      <ArenaBounds />
      {shouldRenderVisualEffects ? <AtmosphereParticles /> : null}

      <mesh
        position={[0, -0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={shouldRenderVisualEffects}
      >
        <planeGeometry args={[GAME_GROUND_SIZE, GAME_GROUND_SIZE]} />
        <meshStandardMaterial map={groundTexture} color="#ffffff" />
      </mesh>
      {shouldRenderVisualEffects ? (
        <StormLightning
          directionalLightRef={directionalLightRef}
          spotlightRef={spotlightRef}
        />
      ) : null}
      <directionalLight
        castShadow={shouldRenderVisualEffects}
        color={DIRECTIONAL_LIGHT_BASE_COLOR}
        intensity={mapDirectionalLightIntensity}
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
      <CrateField
        crateLayouts={crateLayouts}
        shouldRenderVisualEffects={shouldRenderVisualEffects}
      />
      <Enemy
        enemyCount={difficultyConfig.enemyCount}
        enemyStateRef={enemyStateRef}
      />
      {shouldRenderVisualEffects ? (
        <EnemyExplosionParticles
          particleStatesRef={enemyExplosionParticleStateRef}
        />
      ) : null}
      {shouldRenderVisualEffects ? (
        <ExplosionParticles
          color={TNT_EXPLOSION_PARTICLE_COLOR}
          emissive={TNT_EXPLOSION_PARTICLE_EMISSIVE}
          emissiveIntensity={1.5}
          particlePoolSize={TNT_EXPLOSION_PARTICLE_POOL_SIZE}
          particleStatesRef={tntExplosionParticleStateRef}
        />
      ) : null}
      <PainkillerPickups
        painkillerStateRef={painkillerStateRef}
        treeLayouts={treeLayouts}
      />
      <TntBoxes
        onPlayerTouch={detonateTntBox}
        playerBodyName={playerRigidBodyName}
        tntBoxStateRef={tntBoxStateRef}
      />
      <AxeProjectiles projectilesRef={projectilesRef} />
      {shouldRenderVisualEffects ? (
        <FloatingCombatText
          floatingCombatTextStateRef={floatingCombatTextStateRef}
          playerPositionRef={playerPositionRef}
        />
      ) : null}
      {shouldRenderVisualEffects ? (
        <Clouds material={MeshBasicMaterial}>
          {cloudConfigs.map((cloudConfig) => (
            <Cloud
              bounds={cloudConfig.bounds}
              color={cloudConfig.color}
              fade={cloudConfig.fade}
              key={cloudConfig.seed}
              position={cloudConfig.position}
              scale={cloudConfig.scale}
              seed={cloudConfig.seed}
              segments={cloudConfig.segments}
              volume={cloudConfig.volume}
            />
          ))}
        </Clouds>
      ) : null}
      <RigidBody
        canSleep={false}
        colliders={false}
        lockRotations
        name={playerRigidBodyName}
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
          friction={0}
        />
        <Suspense fallback={null}>
          <CharacterModel
            characterConfig={characterConfig}
            groundOffset={PLAYER_BODY_GROUND_OFFSET}
            groupRef={playerRef}
            isHitFlashing={isPlayerHitFlashing}
          >
            {showHealthMeter ? (
              <PlayerHealthMeter
                health={health}
                isMobileViewport={isMobileViewport}
                playerName={playerName}
              />
            ) : null}
          </CharacterModel>
        </Suspense>
      </RigidBody>

      {!isMobileViewport ? <GameSceneInstructions key={roundKey} /> : null}

      {!isMobileViewport ? (
        <PointerLockControls
          makeDefault
          enabled={isActive}
          maxPolarAngle={POINTER_LOCK_MAX_POLAR_ANGLE}
          minPolarAngle={POINTER_LOCK_MIN_POLAR_ANGLE}
          onLock={handlePointerLock}
          onUnlock={handlePointerUnlock}
          pointerSpeed={POINTER_LOCK_SPEED}
          selector={POINTER_LOCK_SELECTOR}
        />
      ) : null}
    </>
  )
}
