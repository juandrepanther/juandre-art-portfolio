import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import { useRef } from 'react'
import type { RefObject } from 'react'
import { Box3, Mesh, Vector3 } from 'three'
import type { Group } from 'three'

interface IVikingAvatar {
  playerRef: RefObject<Group | null>
}

const lowPolyVikingModelUrl = new URL(
  'assets/models/low_poly_viking.glb',
  import.meta.url
).href

const vikingModelScale = 1
const vikingModelHeightOffset = 1.651

useGLTF.preload(lowPolyVikingModelUrl)

function VikingAvatar({ playerRef }: IVikingAvatar) {
  const { scene } = useGLTF(lowPolyVikingModelUrl)
  const modelRef = useRef<Group | null>(null)

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = false
        object.receiveShadow = false
      }
    })
  }, [scene])

  useEffect(() => {
    if (!modelRef.current) {
      return
    }

    const bounds = new Box3().setFromObject(modelRef.current)
    const center = new Vector3()

    bounds.getCenter(center)

    modelRef.current.position.set(-center.x, -bounds.min.y, -center.z)
  }, [scene])

  return (
    <group
      ref={playerRef}
      position={[0, vikingModelHeightOffset, 0]}
      scale={vikingModelScale}
    >
      <group ref={modelRef} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  )
}

export default VikingAvatar
