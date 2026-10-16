import { Billboard, Html } from '@react-three/drei'
import {
  CapsuleCollider,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody
} from '@react-three/rapier'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  MeshStandardMaterial as ThreeMeshStandardMaterial,
  PointLight,
  ShaderMaterial,
  Vector3
} from 'three'
import { isPointInsideAnyCrate } from './world-collision'
import {
  ARENA_BOUNDARY_COLLIDER_HEIGHT,
  ARENA_BOUNDARY_COLLIDER_THICKNESS,
  BOX_LAYOUTS,
  DIFFICULTY_CONFIGS,
  GAME_ARENA_HALF_SIZE,
  GAME_FOG_FAR,
  GAME_FOG_NEAR,
  GAME_GROUND_SIZE,
  HEART_HEAL,
  HEART_RESPAWN_SECONDS,
  MAX_HEALTH,
  MONKEY_DAMAGE,
  MONKEY_RESPAWN_SECONDS,
  PLAYER_AXE_SPEED,
  PLAYER_MOVE_SPEED,
  PLAYER_START_POSITION,
  PROJECTILE_LIFETIME_SECONDS,
  TREE_TRUNK_COLLIDER_ARGS,
  TREE_LAYOUTS,
  type IGameSceneProps
} from './helpers'
import {
  animatedFragmentShader,
  animatedVertexShader,
  atmosphereFragmentShader,
  atmosphereVertexShader,
  particleFragmentShader,
  particleVertexShader
} from './shaders'
import VikingAvatar from './viking-avatar'

interface IAnimatedSurfaceMaterial {
  accentColor: string
  amplitude: number
  baseColor: string
}

interface IProjectileState {
  active: boolean
  owner: 'monkey' | 'player'
  position: Vector3
  ttl: number
  velocity: Vector3
}

interface IMonkeyState {
  active: boolean
  animationOffset: number
  homePosition: Vector3
  nextThrowAt: number
  position: Vector3
  respawnAt: number
  rotationY: number
  targetPosition: Vector3
}

interface IHeartState {
  active: boolean
  animationOffset: number
  position: Vector3
  respawnAt: number
  treeIndex: number
}

interface IControlsState {
  backward: boolean
  left: boolean
  right: boolean
  forward: boolean
}

const arenaHalfSize = GAME_ARENA_HALF_SIZE
const monkeyAimPrecision = 0.1
const atmosphereParticleCount = 180
const projectilePoolSize = 40
const monkeyHitRadius = 1.45
const monkeyHitboxOffset = new Vector3(0, 0.95, 0)
const survivorMonkeyFlightHeightMax = 6.1
const survivorMonkeyFlightHeightMin = 2.2
const survivorMonkeyFlightProximity = 0.7
const survivorMonkeyFlightSpeed = 4.2
const heartSpawnRadiusMin = 1.8
const heartSpawnRadiusMax = 3.1
const playerHitRadius = 1.35
const playerFacingTurnSpeed = 10
const pointerLookSensitivity = 0.0022
const pointerMaxPitch = Math.PI / 3.1
const pointerMinPitch = -Math.PI / 4.2
const playerCameraDistance = 6.5
const playerCameraHeight = 3.3
const playerHitboxOffset = new Vector3(0, 1.2, 0)
const playerColliderHalfHeight = 0.65
const playerColliderRadius = 0.58
const worldUp = new Vector3(0, 1, 0)

function createLookDirection(yaw: number, pitch: number) {
  const cosPitch = Math.cos(pitch)

  return new Vector3(
    Math.sin(yaw) * cosPitch,
    Math.sin(pitch),
    -Math.cos(yaw) * cosPitch
  ).normalize()
}

function createProjectileState(): IProjectileState {
  return {
    active: false,
    owner: 'player',
    position: new Vector3(),
    ttl: 0,
    velocity: new Vector3()
  }
}

function createAtmosphereParticleData() {
  const positions = new Float32Array(atmosphereParticleCount * 3)
  const scales = new Float32Array(atmosphereParticleCount)

  for (let index = 0; index < atmosphereParticleCount; index += 1) {
    const positionOffset = index * 3

    positions[positionOffset] = (Math.random() - 0.5) * arenaHalfSize * 3.4
    positions[positionOffset + 1] = 1.4 + Math.random() * 11.5
    positions[positionOffset + 2] = (Math.random() - 0.5) * arenaHalfSize * 3.4
    scales[index] = 8 + Math.random() * 16
  }

  return { positions, scales }
}

function createRandomMonkeyFlightPosition() {
  return new Vector3(
    clampToArena((Math.random() - 0.5) * arenaHalfSize * 2),
    survivorMonkeyFlightHeightMin +
      Math.random() *
        (survivorMonkeyFlightHeightMax - survivorMonkeyFlightHeightMin),
    clampToArena((Math.random() - 0.5) * arenaHalfSize * 2)
  )
}

function createMonkeyState() {
  return TREE_LAYOUTS.map((layout, index) => ({
    active: true,
    animationOffset: index * 0.7,
    homePosition: new Vector3(...layout.monkeyPosition),
    nextThrowAt: 0,
    position: new Vector3(...layout.monkeyPosition),
    respawnAt: 0,
    rotationY: 0,
    targetPosition: createRandomMonkeyFlightPosition()
  }))
}

function createHeartState() {
  return TREE_LAYOUTS.map(({ treePosition }, index) => ({
    active: true,
    animationOffset: index * 0.45,
    position: createRandomHeartPosition(treePosition),
    respawnAt: 0,
    treeIndex: index
  }))
}

function createRandomHeartPosition(treePosition: [number, number, number]) {
  const angle = Math.random() * Math.PI * 2
  const radius =
    heartSpawnRadiusMin +
    Math.random() * (heartSpawnRadiusMax - heartSpawnRadiusMin)

  return new Vector3(
    clampToArena(treePosition[0] + Math.cos(angle) * radius),
    0.9,
    clampToArena(treePosition[2] + Math.sin(angle) * radius)
  )
}

function clampToArena(value: number) {
  return Math.max(-arenaHalfSize, Math.min(arenaHalfSize, value))
}

function isPointInsideTreeTrunk(point: Vector3) {
  return TREE_LAYOUTS.some(({ treePosition }) => {
    const deltaX = Math.abs(point.x - treePosition[0])
    const deltaZ = Math.abs(point.z - treePosition[2])

    return (
      deltaX <= TREE_TRUNK_COLLIDER_ARGS[0] + 0.08 &&
      deltaZ <= TREE_TRUNK_COLLIDER_ARGS[2] + 0.08 &&
      point.y >= 0 &&
      point.y <= TREE_TRUNK_COLLIDER_ARGS[1] * 2 + 0.2
    )
  })
}

function AnimatedSurfaceMaterial({
  accentColor,
  amplitude,
  baseColor
}: IAnimatedSurfaceMaterial) {
  const materialRef = useRef<ShaderMaterial | null>(null)

  useFrame(({ clock }) => {
    if (!materialRef.current) {
      return
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <shaderMaterial
      ref={materialRef}
      fragmentShader={animatedFragmentShader}
      uniforms={{
        uAccentColor: { value: new Color(accentColor) },
        uAmplitude: { value: amplitude },
        uBaseColor: { value: new Color(baseColor) },
        uTime: { value: 0 }
      }}
      vertexShader={animatedVertexShader}
    />
  )
}

function AtmosphereDome() {
  const materialRef = useRef<ShaderMaterial | null>(null)

  useFrame(({ clock }) => {
    if (!materialRef.current) {
      return
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh position={[0, 10, 0]}>
      <sphereGeometry args={[52, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={atmosphereFragmentShader}
        side={BackSide}
        uniforms={{
          uTime: { value: 0 }
        }}
        vertexShader={atmosphereVertexShader}
      />
    </mesh>
  )
}

function AtmosphereParticles() {
  const geometryRef = useRef<BufferGeometry | null>(null)
  const materialRef = useRef<ShaderMaterial | null>(null)
  const particleDataRef = useRef(createAtmosphereParticleData())

  useEffect(() => {
    if (!geometryRef.current) {
      return
    }

    geometryRef.current.setAttribute(
      'position',
      new Float32BufferAttribute(particleDataRef.current.positions, 3)
    )
    geometryRef.current.setAttribute(
      'aScale',
      new Float32BufferAttribute(particleDataRef.current.scales, 1)
    )
  }, [])

  useFrame(({ clock }) => {
    if (!materialRef.current) {
      return
    }

    materialRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points position={[0, 0.5, 0]} rotation={[0, 0.18, 0]}>
      <bufferGeometry ref={geometryRef} />
      <shaderMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        depthWrite={false}
        fragmentShader={particleFragmentShader}
        transparent
        uniforms={{
          uColorA: { value: new Color('#d8fff2') },
          uColorB: { value: new Color('#ffe6b8') },
          uTime: { value: 0 }
        }}
        vertexShader={particleVertexShader}
      />
    </points>
  )
}

function CinematicLights() {
  const fillLightRef = useRef<PointLight | null>(null)
  const rimLightRef = useRef<PointLight | null>(null)

  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime

    if (fillLightRef.current) {
      fillLightRef.current.position.set(
        Math.sin(elapsedTime * 0.35) * 11,
        5.5 + Math.sin(elapsedTime * 0.6) * 0.7,
        Math.cos(elapsedTime * 0.32) * 9
      )
      fillLightRef.current.intensity = 1.35 + Math.sin(elapsedTime * 1.1) * 0.18
    }

    if (rimLightRef.current) {
      rimLightRef.current.position.set(
        Math.cos(elapsedTime * 0.27) * -12,
        4.3 + Math.cos(elapsedTime * 0.5) * 0.8,
        Math.sin(elapsedTime * 0.3) * 10
      )
      rimLightRef.current.intensity = 1.1 + Math.cos(elapsedTime * 0.95) * 0.16
    }
  })

  return (
    <>
      <pointLight
        ref={fillLightRef}
        color="#8ff0d2"
        decay={2}
        distance={32}
        intensity={1.35}
        position={[8, 6, 4]}
      />
      <pointLight
        ref={rimLightRef}
        color="#ffd2a2"
        decay={2}
        distance={28}
        intensity={1.1}
        position={[-10, 4.5, -6]}
      />
    </>
  )
}

function EvergreenTree({ variant }: { variant: 0 | 1 | 2 }) {
  switch (variant) {
    case 0:
      return (
        <>
          <mesh castShadow position={[0, 1.75, 0]} receiveShadow>
            <cylinderGeometry args={[0.35, 0.58, 3.5, 8]} />
            <meshStandardMaterial color="#8c6141" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 4.2, 0]} receiveShadow>
            <coneGeometry args={[2.1, 4.2, 12]} />
            <AnimatedSurfaceMaterial
              accentColor="#c8f2d7"
              amplitude={0.08}
              baseColor="#78bb89"
            />
          </mesh>
          <mesh castShadow position={[0.52, 3.45, 0.4]} receiveShadow>
            <sphereGeometry args={[1.08, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#cdebc0"
              amplitude={0.06}
              baseColor="#6ba86f"
            />
          </mesh>
        </>
      )
    case 1:
      return (
        <>
          <mesh
            castShadow
            position={[0, 1.55, 0]}
            rotation={[0.08, 0, -0.08]}
            receiveShadow
          >
            <cylinderGeometry args={[0.26, 0.52, 3.1, 7]} />
            <meshStandardMaterial color="#8a6040" roughness={0.94} />
          </mesh>
          <mesh
            castShadow
            position={[0.18, 3.15, 0]}
            rotation={[0.06, 0.16, 0.04]}
            receiveShadow
          >
            <coneGeometry args={[1.55, 2.3, 10]} />
            <AnimatedSurfaceMaterial
              accentColor="#d0efcb"
              amplitude={0.07}
              baseColor="#77af7d"
            />
          </mesh>
          <mesh
            castShadow
            position={[-0.35, 4.2, -0.1]}
            rotation={[-0.08, 0.4, -0.06]}
            receiveShadow
          >
            <coneGeometry args={[1.18, 1.95, 10]} />
            <AnimatedSurfaceMaterial
              accentColor="#d7efc9"
              amplitude={0.05}
              baseColor="#8ec387"
            />
          </mesh>
          <mesh
            castShadow
            position={[0.52, 2.7, 0.12]}
            rotation={[0.4, 0.1, 0.86]}
          >
            <cylinderGeometry args={[0.07, 0.09, 1.15, 6]} />
            <meshStandardMaterial color="#8c6141" roughness={0.95} />
          </mesh>
        </>
      )
    default:
      return (
        <>
          <mesh castShadow position={[0, 1.9, 0]} receiveShadow>
            <cylinderGeometry args={[0.42, 0.68, 3.8, 9]} />
            <meshStandardMaterial color="#8e6648" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 4.1, 0]} receiveShadow>
            <sphereGeometry args={[1.5, 18, 18]} />
            <AnimatedSurfaceMaterial
              accentColor="#c4ecd0"
              amplitude={0.05}
              baseColor="#74b07d"
            />
          </mesh>
          <mesh castShadow position={[-0.9, 3.72, 0.24]} receiveShadow>
            <sphereGeometry args={[0.92, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#d1eec3"
              amplitude={0.04}
              baseColor="#6ba86f"
            />
          </mesh>
          <mesh castShadow position={[0.88, 3.54, -0.08]} receiveShadow>
            <sphereGeometry args={[1, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#c8f2d7"
              amplitude={0.04}
              baseColor="#78bb89"
            />
          </mesh>
        </>
      )
  }
}

function TreeCluster() {
  return (
    <group>
      {TREE_LAYOUTS.map(({ treePosition }, index) => (
        <RigidBody
          colliders={false}
          key={`tree-${index}`}
          position={treePosition}
          rotation={[0, (index % 2 === 0 ? 1 : -1) * 0.18 * (index + 1), 0]}
          type="fixed"
        >
          <CuboidCollider args={TREE_TRUNK_COLLIDER_ARGS} position={[0, 1.95, 0]} />
          <EvergreenTree variant={(index % 3) as 0 | 1 | 2} />
        </RigidBody>
      ))}
    </group>
  )
}

function CrateField() {
  return (
    <group>
      {BOX_LAYOUTS.map((crateLayout, index) => (
        <CrateObstacle crateLayout={crateLayout} index={index} key={`crate-${index}`} />
      ))}
    </group>
  )
}

function CrateObstacle({
  crateLayout,
  index
}: {
  crateLayout: (typeof BOX_LAYOUTS)[number]
  index: number
}) {
  const [width, height, depth] = crateLayout.size

  return (
    <RigidBody
      colliders={false}
      position={crateLayout.position}
      rotation={[0, crateLayout.rotationY, 0]}
      type="fixed"
    >
      <CuboidCollider args={[width / 2, height / 2, depth / 2]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={crateLayout.size} />
        <meshStandardMaterial
          color={index % 2 === 0 ? '#8f6845' : '#7b583a'}
          roughness={0.9}
        />
      </mesh>
      <mesh castShadow position={[0, height * 0.1, depth * 0.38]} receiveShadow>
        <boxGeometry args={[width * 0.9, height * 0.22, depth * 0.14]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
      <mesh castShadow position={[0, height * 0.1, -depth * 0.38]} receiveShadow>
        <boxGeometry args={[width * 0.9, height * 0.22, depth * 0.14]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
      <mesh castShadow position={[width * 0.38, height * 0.08, 0]} receiveShadow>
        <boxGeometry args={[width * 0.14, height * 0.22, depth * 0.88]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
      <mesh castShadow position={[-width * 0.38, height * 0.08, 0]} receiveShadow>
        <boxGeometry args={[width * 0.14, height * 0.22, depth * 0.88]} />
        <meshStandardMaterial color="#c59b63" roughness={0.84} />
      </mesh>
    </RigidBody>
  )
}

function ArenaBounds() {
  const halfThickness = ARENA_BOUNDARY_COLLIDER_THICKNESS / 2
  const sideLength = arenaHalfSize + ARENA_BOUNDARY_COLLIDER_THICKNESS
  const halfHeight = ARENA_BOUNDARY_COLLIDER_HEIGHT / 2

  return (
    <group>
      <CuboidCollider
        args={[halfThickness, halfHeight, sideLength]}
        position={[arenaHalfSize + halfThickness, halfHeight, 0]}
      />
      <CuboidCollider
        args={[halfThickness, halfHeight, sideLength]}
        position={[-arenaHalfSize - halfThickness, halfHeight, 0]}
      />
      <CuboidCollider
        args={[sideLength, halfHeight, halfThickness]}
        position={[0, halfHeight, arenaHalfSize + halfThickness]}
      />
      <CuboidCollider
        args={[sideLength, halfHeight, halfThickness]}
        position={[0, halfHeight, -arenaHalfSize - halfThickness]}
      />
    </group>
  )
}

function HeartPickups({
  heartStateRef
}: {
  heartStateRef: RefObject<IHeartState[]>
}) {
  return (
    <group>
      {TREE_LAYOUTS.map((_, index) => (
        <HeartPickup
          heartStateRef={heartStateRef}
          index={index}
          key={`heart-${index}`}
        />
      ))}
    </group>
  )
}

function HeartPickup({
  heartStateRef,
  index
}: {
  heartStateRef: RefObject<IHeartState[]>
  index: number
}) {
  const heartRef = useRef<Group | null>(null)

  useFrame(({ clock }) => {
    const heartState = heartStateRef.current[index]

    if (!heartRef.current || !heartState) {
      return
    }

    heartRef.current.visible = heartState.active
    heartRef.current.position.copy(heartState.position)
    heartRef.current.position.y +=
      Math.sin(clock.elapsedTime * 2 + heartState.animationOffset) * 0.12
    heartRef.current.rotation.y = clock.elapsedTime * 1.4
  })

  return (
    <group ref={heartRef}>
      <mesh castShadow>
        <sphereGeometry args={[0.4, 20, 20]} />
        <AnimatedSurfaceMaterial
          accentColor="#ffe5ea"
          amplitude={0.03}
          baseColor="#ff7b95"
        />
      </mesh>
      <mesh castShadow position={[-0.22, -0.08, 0]} rotation={[0, 0, 0.88]}>
        <capsuleGeometry args={[0.16, 0.26, 4, 8]} />
        <meshStandardMaterial color="#ff9ab0" />
      </mesh>
      <mesh castShadow position={[0.22, -0.08, 0]} rotation={[0, 0, -0.88]}>
        <capsuleGeometry args={[0.16, 0.26, 4, 8]} />
        <meshStandardMaterial color="#ff9ab0" />
      </mesh>
    </group>
  )
}

function VikingTroop({
  monkeyStateRef
}: {
  monkeyStateRef: RefObject<IMonkeyState[]>
}) {
  return (
    <group>
      {TREE_LAYOUTS.map((_, index) => (
        <VikingEnemy
          index={index}
          key={`monkey-${index}`}
          monkeyStateRef={monkeyStateRef}
        />
      ))}
    </group>
  )
}

function VikingEnemy({
  index,
  monkeyStateRef
}: {
  index: number
  monkeyStateRef: RefObject<IMonkeyState[]>
}) {
  const monkeyRef = useRef<Group | null>(null)

  useFrame(({ clock }) => {
    const monkeyState = monkeyStateRef.current[index]

    if (!monkeyRef.current || !monkeyState) {
      return
    }

    monkeyRef.current.visible = monkeyState.active
    monkeyRef.current.position.copy(monkeyState.position)
    monkeyRef.current.rotation.y = monkeyState.rotationY
    monkeyRef.current.position.y +=
      Math.sin(clock.elapsedTime * 3 + monkeyState.animationOffset) * 0.06
  })

  return (
    <group ref={monkeyRef}>
      <mesh castShadow position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.42, 0.8, 8, 12]} />
        <AnimatedSurfaceMaterial
          accentColor="#d8dbe0"
          amplitude={0.05}
          baseColor="#6d737b"
        />
      </mesh>
      <mesh castShadow position={[0, 1.7, 0.12]}>
        <sphereGeometry args={[0.34, 18, 18]} />
        <AnimatedSurfaceMaterial
          accentColor="#ecd2b0"
          amplitude={0.04}
          baseColor="#d7a06b"
        />
      </mesh>
      <mesh castShadow position={[0, 2.05, 0.08]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.42, 0.48, 0.42, 10]} />
        <meshStandardMaterial
          color="#8b9298"
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>
      <mesh castShadow position={[0.46, 2.1, 0.1]} rotation={[0, 0, -0.65]}>
        <coneGeometry args={[0.12, 0.64, 8]} />
        <meshStandardMaterial
          color="#cfd6dc"
          metalness={0.45}
          roughness={0.38}
        />
      </mesh>
      <mesh castShadow position={[-0.46, 2.1, 0.1]} rotation={[0, 0, 0.65]}>
        <coneGeometry args={[0.12, 0.64, 8]} />
        <meshStandardMaterial
          color="#cfd6dc"
          metalness={0.45}
          roughness={0.38}
        />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0.22]} rotation={[0, 0, 0.2]}>
        <coneGeometry args={[0.24, 0.48, 8]} />
        <meshStandardMaterial color="#6f4a2e" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0.35, 1.75, 0.38]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#241b18" />
      </mesh>
      <mesh castShadow position={[-0.35, 1.75, 0.38]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#241b18" />
      </mesh>
    </group>
  )
}

function AxeProjectiles({
  projectilesRef
}: {
  projectilesRef: RefObject<IProjectileState[]>
}) {
  return (
    <group>
      {Array.from({ length: projectilePoolSize }, (_, index) => (
        <AxeProjectile
          index={index}
          key={`axe-${index}`}
          projectilesRef={projectilesRef}
        />
      ))}
    </group>
  )
}

function AxeProjectile({
  index,
  projectilesRef
}: {
  index: number
  projectilesRef: RefObject<IProjectileState[]>
}) {
  const axeRef = useRef<Group | null>(null)
  const handleMaterialRef = useRef<ThreeMeshStandardMaterial | null>(null)
  const bladeMaterialRef = useRef<ThreeMeshStandardMaterial | null>(null)
  const bladeEdgeMaterialRef = useRef<ThreeMeshStandardMaterial | null>(null)

  useFrame(() => {
    const projectileState = projectilesRef.current[index]

    if (
      !axeRef.current ||
      !handleMaterialRef.current ||
      !bladeMaterialRef.current ||
      !bladeEdgeMaterialRef.current ||
      !projectileState
    ) {
      return
    }

    axeRef.current.visible = projectileState.active
    axeRef.current.position.copy(projectileState.position)
    handleMaterialRef.current.color.set(
      projectileState.owner === 'player' ? '#7b5534' : '#543625'
    )
    bladeMaterialRef.current.color.set(
      projectileState.owner === 'player' ? '#d9e4ea' : '#b2bcc3'
    )
    bladeEdgeMaterialRef.current.color.set(
      projectileState.owner === 'player' ? '#eaf0f4' : '#c1c9d0'
    )

    if (projectileState.velocity.lengthSq() > 0) {
      axeRef.current.rotation.z += 0.18
    }
  })

  return (
    <group ref={axeRef}>
      <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.045, 0.055, 0.92, 8]} />
        <meshStandardMaterial
          ref={handleMaterialRef}
          color="#7b5534"
          roughness={0.86}
        />
      </mesh>
      <mesh castShadow position={[0.2, 0.18, 0]} rotation={[0, 0, 0.22]}>
        <boxGeometry args={[0.34, 0.14, 0.08]} />
        <meshStandardMaterial
          ref={bladeMaterialRef}
          color="#d9e4ea"
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>
      <mesh castShadow position={[0.34, 0.28, 0]} rotation={[0, 0, 0.72]}>
        <coneGeometry args={[0.1, 0.34, 8]} />
        <meshStandardMaterial
          ref={bladeEdgeMaterialRef}
          color="#d9e4ea"
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>
      <mesh castShadow position={[-0.12, -0.18, 0]} rotation={[0, 0, -0.7]}>
        <coneGeometry args={[0.06, 0.22, 8]} />
        <meshStandardMaterial
          color="#b7c0c8"
          metalness={0.66}
          roughness={0.26}
        />
      </mesh>
    </group>
  )
}

function RoundStage({
  difficulty,
  isActive,
  onHealthChange,
  onMonkeyHit,
  roundKey
}: IGameSceneProps) {
  const { camera, clock, gl } = useThree()
  const difficultyConfig = DIFFICULTY_CONFIGS[difficulty]
  const playerRef = useRef<Group | null>(null)
  const playerBodyRef = useRef<RapierRigidBody | null>(null)
  const controlsRef = useRef<IControlsState>({
    backward: false,
    forward: false,
    left: false,
    right: false
  })
  const playerPositionRef = useRef(new Vector3(...PLAYER_START_POSITION))
  const playerVelocityRef = useRef(new Vector3())
  const playerDirectionRef = useRef(new Vector3(0, 0, -1))
  const projectilesRef = useRef(
    Array.from({ length: projectilePoolSize }, createProjectileState)
  )
  const monkeyStateRef = useRef(createMonkeyState())
  const heartStateRef = useRef(createHeartState())
  const healthRef = useRef(MAX_HEALTH)
  const lastDamageAtRef = useRef(-10)
  const onHealthChangeRef = useRef(onHealthChange)
  const onMonkeyHitRef = useRef(onMonkeyHit)
  const cameraPosition = camera.position
  const cameraYawRef = useRef(0)
  const cameraPitchRef = useRef(-0.24)
  const isPointerLockedRef = useRef(false)
  const cameraLookDirectionRef = useRef(new Vector3(0, 0, -1))
  const cameraForwardRef = useRef(new Vector3(0, 0, -1))
  const cameraRightRef = useRef(new Vector3(1, 0, 0))
  const desiredFacingRef = useRef(new Vector3(0, 0, -1))

  const setHealth = (health: number) => {
    healthRef.current = health
    onHealthChangeRef.current(health)
  }

  useEffect(() => {
    onHealthChangeRef.current = onHealthChange
  }, [onHealthChange])

  useEffect(() => {
    onMonkeyHitRef.current = onMonkeyHit
  }, [onMonkeyHit])

  const spawnProjectile = (
    origin: Vector3,
    velocity: Vector3,
    owner: 'monkey' | 'player'
  ) => {
    const projectile = projectilesRef.current.find(
      (candidate) => !candidate.active
    )

    if (!projectile) {
      return
    }

    projectile.active = true
    projectile.owner = owner
    projectile.position.copy(origin)
    projectile.velocity.copy(velocity)
    projectile.ttl = PROJECTILE_LIFETIME_SECONDS
  }

  useEffect(() => {
    const clearControls = () => {
      controlsRef.current.forward = false
      controlsRef.current.backward = false
      controlsRef.current.left = false
      controlsRef.current.right = false
    }

    const requestPointerLock = async () => {
      if (document.pointerLockElement === gl.domElement) {
        return true
      }

      await gl.domElement.requestPointerLock()
      return document.pointerLockElement === gl.domElement
    }

    const handleShoot = () => {
      if (!isActive) {
        return
      }

      const origin = playerPositionRef.current
        .clone()
        .add(new Vector3(0, 1.35, 0))
      const velocity = cameraLookDirectionRef.current
        .clone()
        .multiplyScalar(PLAYER_AXE_SPEED)

      spawnProjectile(origin, velocity, 'player')
    }

    const handleKeyChange = (isPressed: boolean) => (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          event.preventDefault()
          controlsRef.current.forward = isPressed
          break
        case 'KeyS':
        case 'ArrowDown':
          event.preventDefault()
          controlsRef.current.backward = isPressed
          break
        case 'KeyA':
        case 'ArrowLeft':
          event.preventDefault()
          controlsRef.current.left = isPressed
          break
        case 'KeyD':
        case 'ArrowRight':
          event.preventDefault()
          controlsRef.current.right = isPressed
          break
        default:
          break
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target

      if (target instanceof HTMLCanvasElement) {
        void requestPointerLock().then((isLocked) => {
          if (isLocked) {
            handleShoot()
          }
        })
      }
    }

    const handleBlur = () => {
      clearControls()
    }

    const handlePointerLockChange = () => {
      isPointerLockedRef.current = document.pointerLockElement === gl.domElement
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPointerLockedRef.current) {
        return
      }

      cameraYawRef.current += event.movementX * pointerLookSensitivity
      cameraPitchRef.current = Math.max(
        pointerMinPitch,
        Math.min(
          pointerMaxPitch,
          cameraPitchRef.current - event.movementY * pointerLookSensitivity
        )
      )
    }

    const handleMovementKeyDown = handleKeyChange(true)
    const handleKeyUp = handleKeyChange(false)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()

        if (!event.repeat) {
          handleShoot()
        }

        return
      }

      handleMovementKeyDown(event)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('pointerlockchange', handlePointerLockChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)

      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock()
      }

      clearControls()
    }
  }, [gl, isActive])

  useEffect(() => {
    playerPositionRef.current.set(...PLAYER_START_POSITION)
    playerVelocityRef.current.set(0, 0, 0)
    playerDirectionRef.current.set(0, 0, -1)
    desiredFacingRef.current.set(0, 0, -1)
    cameraYawRef.current = 0
    cameraPitchRef.current = -0.24
    isPointerLockedRef.current = document.pointerLockElement === gl.domElement
    cameraLookDirectionRef.current.copy(
      createLookDirection(cameraYawRef.current, cameraPitchRef.current)
    )
    cameraForwardRef.current.set(0, 0, -1)
    cameraRightRef.current.set(1, 0, 0)
    controlsRef.current.forward = false
    controlsRef.current.backward = false
    controlsRef.current.left = false
    controlsRef.current.right = false
    monkeyStateRef.current = createMonkeyState()
    heartStateRef.current = createHeartState()

    playerBodyRef.current?.setTranslation(
      {
        x: PLAYER_START_POSITION[0],
        y: PLAYER_START_POSITION[1],
        z: PLAYER_START_POSITION[2]
      },
      true
    )
    playerBodyRef.current?.setLinvel({ x: 0, y: 0, z: 0 }, true)

    cameraPosition
      .set(...PLAYER_START_POSITION)
      .add(new Vector3(0, playerCameraHeight, playerCameraDistance))
    camera.lookAt(
      playerPositionRef.current
        .clone()
        .add(cameraLookDirectionRef.current.clone().multiplyScalar(18))
    )

    for (const projectile of projectilesRef.current) {
      projectile.active = false
      projectile.ttl = 0
      projectile.position.set(0, 0, 0)
      projectile.velocity.set(0, 0, 0)
    }

    lastDamageAtRef.current = -10
    healthRef.current = MAX_HEALTH
    onHealthChangeRef.current(MAX_HEALTH)
  }, [camera, cameraPosition, difficulty, gl, roundKey])

  useFrame((_, delta) => {
    const playerBodyTranslation = playerBodyRef.current?.translation()

    if (playerBodyTranslation) {
      playerPositionRef.current.set(
        playerBodyTranslation.x,
        PLAYER_START_POSITION[1],
        playerBodyTranslation.z
      )
    }

    if (playerRef.current) {
      playerRef.current.position.copy(playerPositionRef.current)
    }

    cameraLookDirectionRef.current.copy(
      createLookDirection(cameraYawRef.current, cameraPitchRef.current)
    )
    cameraForwardRef.current.copy(cameraLookDirectionRef.current)
    cameraForwardRef.current.y = 0

    if (cameraForwardRef.current.lengthSq() <= 0.0001) {
      cameraForwardRef.current.set(0, 0, -1)
    } else {
      cameraForwardRef.current.normalize()
    }

    cameraRightRef.current
      .crossVectors(cameraForwardRef.current, worldUp)
      .normalize()

    const desiredCameraPosition = playerPositionRef.current
      .clone()
      .add(new Vector3(0, playerCameraHeight, 0))
      .add(
        cameraLookDirectionRef.current
          .clone()
          .multiplyScalar(-playerCameraDistance)
      )

    camera.position.lerp(desiredCameraPosition, 1 - Math.exp(-delta * 10))
    camera.lookAt(
      playerPositionRef.current
        .clone()
        .add(new Vector3(0, playerCameraHeight - 0.5, 0))
        .add(cameraLookDirectionRef.current.clone().multiplyScalar(18))
    )

    if (!playerRef.current) {
      return
    }

    const forwardInput =
      Number(controlsRef.current.forward) - Number(controlsRef.current.backward)
    const strafeInput =
      Number(controlsRef.current.right) - Number(controlsRef.current.left)
    const movementAxis = cameraForwardRef.current
      .clone()
      .multiplyScalar(forwardInput)
      .add(cameraRightRef.current.clone().multiplyScalar(strafeInput))

    if (movementAxis.lengthSq() > 0) {
      movementAxis.normalize().multiplyScalar(PLAYER_MOVE_SPEED)
      playerVelocityRef.current.lerp(movementAxis, 1 - Math.exp(-delta * 8))
    } else {
      playerVelocityRef.current.lerp(
        new Vector3(0, 0, 0),
        1 - Math.exp(-delta * 7)
      )
    }

    desiredFacingRef.current.copy(cameraForwardRef.current)
    playerDirectionRef.current.lerp(
      desiredFacingRef.current,
      1 - Math.exp(-delta * playerFacingTurnSpeed)
    )

    if (playerBodyRef.current) {
      playerBodyRef.current.setLinvel(
        {
          x: isActive ? playerVelocityRef.current.x : 0,
          y: 0,
          z: isActive ? playerVelocityRef.current.z : 0
        },
        true
      )
    } else {
      playerPositionRef.current.addScaledVector(playerVelocityRef.current, delta)
      playerPositionRef.current.x = clampToArena(playerPositionRef.current.x)
      playerPositionRef.current.z = clampToArena(playerPositionRef.current.z)
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
      .add(playerHitboxOffset)

    for (const monkeyState of monkeyStateRef.current) {
      if (difficulty === 'Survivor') {
        const travelToTarget = monkeyState.targetPosition
          .clone()
          .sub(monkeyState.position)

        if (
          travelToTarget.lengthSq() <=
          survivorMonkeyFlightProximity * survivorMonkeyFlightProximity
        ) {
          monkeyState.targetPosition.copy(createRandomMonkeyFlightPosition())
        } else {
          monkeyState.position.addScaledVector(
            travelToTarget.normalize(),
            delta * survivorMonkeyFlightSpeed
          )
        }
      } else {
        monkeyState.position.lerp(
          monkeyState.homePosition,
          1 - Math.exp(-delta * 6)
        )
      }

      monkeyState.rotationY = Math.atan2(
        playerPositionRef.current.x - monkeyState.position.x,
        playerPositionRef.current.z - monkeyState.position.z
      )

      if (!monkeyState.active) {
        if (now >= monkeyState.respawnAt) {
          monkeyState.active = true
          if (difficulty === 'Survivor') {
            monkeyState.position.copy(createRandomMonkeyFlightPosition())
            monkeyState.targetPosition.copy(createRandomMonkeyFlightPosition())
          } else {
            monkeyState.position.copy(monkeyState.homePosition)
          }
          monkeyState.nextThrowAt = now + 1.1
        }

        continue
      }

      if (now >= monkeyState.nextThrowAt) {
        const origin = monkeyState.position.clone().add(new Vector3(0, 0.15, 0))
        const target = playerHitboxCenter.clone()
        const distanceToPlayer =
          monkeyState.position.distanceTo(playerHitboxCenter)
        const precisionOffset = distanceToPlayer * monkeyAimPrecision

        target.x += (Math.random() - 0.5) * precisionOffset * 2
        target.z += (Math.random() - 0.5) * precisionOffset * 2

        const direction = target.sub(origin).normalize()

        spawnProjectile(
          origin,
          direction.multiplyScalar(difficultyConfig.axeSpeed),
          'monkey'
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
          BOX_LAYOUTS
        ) ||
        isPointInsideTreeTrunk(projectile.position)
      ) {
        projectile.active = false
        continue
      }

      if (projectile.owner === 'player') {
        const hitMonkey = monkeyStateRef.current.find((monkeyState) => {
          if (!monkeyState.active) {
            return false
          }

          const monkeyHitboxCenter = monkeyState.position
            .clone()
            .add(monkeyHitboxOffset)

          return (
            monkeyHitboxCenter.distanceTo(projectile.position) <=
            monkeyHitRadius
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

      if (
        playerHitboxCenter.distanceTo(projectile.position) <= playerHitRadius &&
        now - lastDamageAtRef.current > 0.3
      ) {
        lastDamageAtRef.current = now
        projectile.active = false
        setHealth(Math.max(0, healthRef.current - MONKEY_DAMAGE))
      }
    }

    for (const heartState of heartStateRef.current) {
      if (!heartState.active) {
        if (now >= heartState.respawnAt) {
          heartState.active = true
          heartState.position.copy(
            createRandomHeartPosition(
              TREE_LAYOUTS[heartState.treeIndex]?.treePosition ??
                TREE_LAYOUTS[0].treePosition
            )
          )
        }

        continue
      }

      if (playerPositionRef.current.distanceTo(heartState.position) <= 1.55) {
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

      <RigidBody
        canSleep={false}
        ccd
        colliders={false}
        enabledRotations={[false, false, false]}
        enabledTranslations={[true, false, true]}
        gravityScale={0}
        linearDamping={10}
        position={PLAYER_START_POSITION}
        ref={playerBodyRef}
      >
        <CapsuleCollider
          args={[playerColliderHalfHeight, playerColliderRadius]}
          position={[0, 1.25, 0]}
        />
      </RigidBody>

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

      <mesh
        position={[0, 0.05, 0]}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[8.5, 10.5, 64]} />
        <meshStandardMaterial color="#dff4d6" roughness={1} />
      </mesh>

      <TreeCluster />
      <CrateField />
      <HeartPickups heartStateRef={heartStateRef} />
      <VikingTroop monkeyStateRef={monkeyStateRef} />
      <AxeProjectiles projectilesRef={projectilesRef} />
      <Suspense fallback={null}>
        <VikingAvatar playerRef={playerRef} />
      </Suspense>

      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 6.8, -2]}
      >
        <Html center>
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '999px',
              color: '#234038',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '14px',
              letterSpacing: '0.06em',
              padding: '14px 22px',
              backdropFilter: 'blur(12px)',
              background: 'rgba(244, 252, 248, 0.72)',
              width: 'min(90vw, 480px)'
            }}
          >
            Click the scene to lock the pointer. Move relative to the camera
            with WASD or the arrow keys, aim with the mouse, and click or press
            Space to hurl an axe through the center reticle.
          </div>
        </Html>
      </Billboard>
    </>
  )
}

function GameScene({
  difficulty,
  isActive,
  onHealthChange,
  onMonkeyHit,
  roundKey
}: IGameSceneProps) {
  return (
    <Canvas
      camera={{ far: 140, fov: 42, near: 0.1, position: [0, 5, 14] }}
      dpr={[1, 1.8]}
      fallback={<div>WebGL is unavailable.</div>}
      shadows
    >
      <Suspense fallback={null}>
        <Physics colliders={false} gravity={[0, 0, 0]}>
          <RoundStage
            difficulty={difficulty}
            isActive={isActive}
            onHealthChange={onHealthChange}
            onMonkeyHit={onMonkeyHit}
            roundKey={roundKey}
          />
        </Physics>
      </Suspense>
    </Canvas>
  )
}

export default GameScene
