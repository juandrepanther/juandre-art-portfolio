import { useTexture } from '@react-three/drei'
import { CuboidCollider } from '@react-three/rapier'
import wallTextureAUrl from 'assets/images/walls/325629332_696367385315034_7945753197499004084_n.jpg?url'
import wallTextureBUrl from 'assets/images/walls/646037352_1508180557978299_6617117737506974697_n.jpg?url'
import wallTextureCUrl from 'assets/images/walls/658362089_18311459722256161_5089121126790970031_n.jpg?url'
import wallTextureDUrl from 'assets/images/walls/711601835_18319464247256161_3176286749324222965_n.jpg?url'
import {
  ARENA_HALF_SIZE,
  ARENA_BOUNDARY_COLLIDER_HEIGHT,
  ARENA_BOUNDARY_COLLIDER_THICKNESS,
  INTERIOR_ARENA_WALL_HEIGHT,
  INTERIOR_ARENA_WALL_SEGMENTS,
  INTERIOR_ARENA_WALL_THICKNESS
} from 'pages/game-page/settings'
import { useEffect } from 'react'
import { RepeatWrapping, SRGBColorSpace } from 'three'

const wallTextureUrls = [
  wallTextureAUrl,
  wallTextureBUrl,
  wallTextureCUrl,
  wallTextureDUrl
]

interface IOuterBoundaryWall {
  args: [number, number, number]
  position: [number, number, number]
}

export function ArenaBounds() {
  const outerHalfThickness = ARENA_BOUNDARY_COLLIDER_THICKNESS / 2
  const outerSideLength = ARENA_HALF_SIZE + ARENA_BOUNDARY_COLLIDER_THICKNESS
  const outerHalfHeight = ARENA_BOUNDARY_COLLIDER_HEIGHT / 2
  const interiorHalfThickness = INTERIOR_ARENA_WALL_THICKNESS / 2
  const interiorHalfHeight = INTERIOR_ARENA_WALL_HEIGHT / 2
  const wallTextures = useTexture(wallTextureUrls)

  useEffect(() => {
    for (const texture of wallTextures) {
      texture.colorSpace = SRGBColorSpace
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.repeat.set(2.2, 1)
      texture.needsUpdate = true
    }
  }, [wallTextures])

  const outerBoundaryWalls: IOuterBoundaryWall[] = [
    {
      args: [outerHalfThickness, outerHalfHeight, outerSideLength],
      position: [ARENA_HALF_SIZE + outerHalfThickness, outerHalfHeight, 0]
    },
    {
      args: [outerHalfThickness, outerHalfHeight, outerSideLength],
      position: [-ARENA_HALF_SIZE - outerHalfThickness, outerHalfHeight, 0]
    },
    {
      args: [outerSideLength, outerHalfHeight, outerHalfThickness],
      position: [0, outerHalfHeight, ARENA_HALF_SIZE + outerHalfThickness]
    },
    {
      args: [outerSideLength, outerHalfHeight, outerHalfThickness],
      position: [0, outerHalfHeight, -ARENA_HALF_SIZE - outerHalfThickness]
    }
  ]

  return (
    <group>
      {outerBoundaryWalls.map(({ args, position }, index) => {
        const width = args[0] * 2
        const height = args[1] * 2
        const depth = args[2] * 2

        return (
          <group key={`outer-boundary-collider-${index}`}>
            <CuboidCollider args={args} position={position} />
            <mesh position={position}>
              <boxGeometry args={[width, height, depth]} />
              <meshBasicMaterial
                color="#85ffd2"
                depthWrite={false}
                opacity={0.18}
                transparent
              />
            </mesh>
          </group>
        )
      })}
      {INTERIOR_ARENA_WALL_SEGMENTS.map((segment, index) => {
        const primaryTexture = wallTextures[index]
        const secondaryTexture = wallTextures[(index + 1) % wallTextures.length]
        const halfLength = segment.length / 2
        const width =
          segment.axis === 'x' ? segment.length : INTERIOR_ARENA_WALL_THICKNESS
        const depth =
          segment.axis === 'x' ? INTERIOR_ARENA_WALL_THICKNESS : segment.length
        const colliderArgs: [number, number, number] =
          segment.axis === 'x'
            ? [halfLength, interiorHalfHeight, interiorHalfThickness]
            : [interiorHalfThickness, interiorHalfHeight, halfLength]
        const wallPosition: [number, number, number] = [
          segment.center[0],
          interiorHalfHeight,
          segment.center[1]
        ]
        const rightSideTexture =
          segment.axis === 'z' ? primaryTexture : secondaryTexture
        const leftSideTexture =
          segment.axis === 'z' ? secondaryTexture : primaryTexture
        const frontSideTexture =
          segment.axis === 'x' ? primaryTexture : secondaryTexture
        const backSideTexture =
          segment.axis === 'x' ? secondaryTexture : primaryTexture

        return (
          <group key={segment.id}>
            <CuboidCollider args={colliderArgs} position={wallPosition} />
            <mesh castShadow position={wallPosition} receiveShadow>
              <boxGeometry args={[width, INTERIOR_ARENA_WALL_HEIGHT, depth]} />
              <meshStandardMaterial
                attach="material-0"
                color="#ffffff"
                map={rightSideTexture}
                metalness={0.1}
                roughness={0.82}
              />
              <meshStandardMaterial
                attach="material-1"
                color="#ffffff"
                map={leftSideTexture}
                metalness={0.1}
                roughness={0.82}
              />
              <meshStandardMaterial
                attach="material-2"
                color="#ffffff"
                map={primaryTexture}
                metalness={0.1}
                roughness={0.82}
              />
              <meshStandardMaterial
                attach="material-3"
                color="#ffffff"
                map={primaryTexture}
                metalness={0.1}
                roughness={0.82}
              />
              <meshStandardMaterial
                attach="material-4"
                color="#ffffff"
                map={frontSideTexture}
                metalness={0.1}
                roughness={0.82}
              />
              <meshStandardMaterial
                attach="material-5"
                color="#ffffff"
                map={backSideTexture}
                metalness={0.1}
                roughness={0.82}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
