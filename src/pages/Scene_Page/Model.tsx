import React, { useEffect } from 'react'
import LabelsDynamic from './LabelsDynamic'
import { useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { modelScale, titleScale } from '../../data/ContentData'
import { useDispatch } from 'react-redux'
import { changeInitialPopupVisibility } from '../../redux/reducers/initialPopupReducer'
import { modelLoader } from '../../utils/modelLoader'
import { changeLogoTopIconsVisibility } from '../../redux/reducers/logoTopIconsReducer'

const Model = () => {
  const canvasData = useThree()
  const dispatch = useDispatch()
  const allIntersectionMeshes = []

  const gltf = modelLoader('/models/Room.glb')

  gltf.scene.traverse(function (model: any) {
    if (model.isMesh) {
      model.material.wireframe = true

      allIntersectionMeshes.push(model)

      if (model.material.map) model.material.map.anisotropy = 16
    } else {
      model.castShadow = false
    }
  })

  useEffect(() => {
    if (canvasData.gl.info.render.triangles) {
      dispatch(changeInitialPopupVisibility(true))
      dispatch(changeLogoTopIconsVisibility(true))
    }
  }, [])

  return (
    <>
      <mesh>
        <primitive object={gltf.scene} scale={modelScale} />
      </mesh>
      <Text
        scale={[titleScale, titleScale, titleScale]}
        color="black"
        fillOpacity={0.8}
        position={[0, 4.5, 0.5]}
        rotation={[0, 0, 0]}
      >
        ROTATE ME
      </Text>
      {/* Labels uses about 100FPS */}
      <LabelsDynamic allIntersectionMeshes={allIntersectionMeshes} />
    </>
  )
}

export default Model
