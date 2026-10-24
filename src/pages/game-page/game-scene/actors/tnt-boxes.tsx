import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  CanvasTexture,
  Mesh,
  MeshStandardMaterial,
  NearestFilter,
  SRGBColorSpace
} from 'three'
import { TNT_BOX_COUNT, TNT_BOX_SIZE } from '../../settings'
import type { ITntBoxState } from '../types'

interface ITntBoxes {
  onPlayerTouch: (index: number) => void
  playerBodyName: string
  tntBoxStateRef: RefObject<ITntBoxState[]>
}

function createTexture(
  drawTexture: (context: CanvasRenderingContext2D) => void
) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('2d canvas context is required for TNT textures')
  }

  context.imageSmoothingEnabled = false
  drawTexture(context)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.generateMipmaps = false
  texture.magFilter = NearestFilter
  texture.minFilter = NearestFilter

  return texture
}

function drawStripedBackground(
  context: CanvasRenderingContext2D,
  baseColor: string,
  stripeColor: string
) {
  context.fillStyle = baseColor
  context.fillRect(0, 0, 128, 128)

  for (let stripeIndex = 0; stripeIndex < 16; stripeIndex += 1) {
    context.fillStyle = stripeIndex % 2 === 0 ? stripeColor : baseColor
    context.fillRect(stripeIndex * 8, 0, 8, 128)
  }
}

function createSideTexture() {
  return createTexture((context) => {
    drawStripedBackground(context, '#d94921', '#bf3414')

    context.fillStyle = '#f1f1f1'
    context.fillRect(0, 42, 128, 44)

    context.fillStyle = '#131313'
    context.font = 'bold 38px monospace'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('TNT', 64, 66)
  })
}

function createTopTexture() {
  return createTexture((context) => {
    drawStripedBackground(context, '#d94921', '#bf3414')

    context.fillStyle = '#2b2b2b'
    context.fillRect(18, 18, 92, 92)
    context.fillStyle = '#5f5f5f'

    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex += 1) {
        if ((rowIndex + columnIndex) % 2 === 0) {
          context.fillRect(24 + columnIndex * 20, 24 + rowIndex * 20, 14, 14)
        }
      }
    }

    context.strokeStyle = '#9a9a9a'
    context.lineWidth = 6
    context.strokeRect(18, 18, 92, 92)
  })
}

function createBottomTexture() {
  return createTexture((context) => {
    drawStripedBackground(context, '#ab2d12', '#8f220d')
  })
}

function createTntMaterials() {
  const sideTexture = createSideTexture()
  const topTexture = createTopTexture()
  const bottomTexture = createBottomTexture()

  return {
    materials: [
      new MeshStandardMaterial({ map: sideTexture, roughness: 0.82 }),
      new MeshStandardMaterial({ map: sideTexture, roughness: 0.82 }),
      new MeshStandardMaterial({ map: topTexture, roughness: 0.78 }),
      new MeshStandardMaterial({ map: bottomTexture, roughness: 0.88 }),
      new MeshStandardMaterial({ map: sideTexture, roughness: 0.82 }),
      new MeshStandardMaterial({ map: sideTexture, roughness: 0.82 })
    ],
    textures: [sideTexture, topTexture, bottomTexture]
  }
}

export function TntBoxes({
  onPlayerTouch,
  playerBodyName,
  tntBoxStateRef
}: ITntBoxes) {
  const meshRefs = useRef<Array<Mesh | null>>([])
  const rigidBodyRefs = useRef<
    Array<null | {
      setTranslation: (
        translation: { x: number; y: number; z: number },
        wakeUp: boolean
      ) => void
    }>
  >([])
  const [{ materials, textures }] = useState(createTntMaterials)

  useEffect(() => {
    return () => {
      for (const material of materials) {
        material.dispose()
      }

      for (const texture of textures) {
        texture.dispose()
      }
    }
  }, [materials, textures])

  useFrame(() => {
    const tntStates = tntBoxStateRef.current

    for (let index = 0; index < meshRefs.current.length; index += 1) {
      const mesh = meshRefs.current[index]
      const tntState = tntStates[index]

      if (!mesh) {
        continue
      }

      if (!tntState) {
        mesh.visible = false
        continue
      }

      rigidBodyRefs.current[index]?.setTranslation(
        {
          x: tntState.position.x,
          y: tntState.position.y,
          z: tntState.position.z
        },
        false
      )
      mesh.visible = tntState.active
    }
  })

  return (
    <group>
      {Array.from({ length: TNT_BOX_COUNT }, (_, index) => (
        <RigidBody
          colliders={false}
          key={`tnt-box-${index}`}
          position={[0, TNT_BOX_SIZE[1] / 2, 0]}
          ref={(body) => {
            rigidBodyRefs.current[index] = body
          }}
          type="fixed"
        >
          <CuboidCollider
            args={[
              TNT_BOX_SIZE[0] / 2,
              TNT_BOX_SIZE[1] / 2,
              TNT_BOX_SIZE[2] / 2
            ]}
            onIntersectionEnter={(payload) => {
              if (payload.other.rigidBodyObject?.name !== playerBodyName) {
                return
              }

              onPlayerTouch(index)
            }}
            sensor
          />
          <mesh
            material={materials}
            ref={(mesh) => {
              meshRefs.current[index] = mesh
            }}
            visible={false}
          >
            <boxGeometry args={TNT_BOX_SIZE} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  )
}
