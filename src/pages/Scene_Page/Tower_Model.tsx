import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { modelScale } from '../../data/ContentData'
import LabelsDynamic from './LabelsDynamic'
import { useDispatch } from 'react-redux'
import { changeInitialPopupVisibility } from '../../redux/reducers/initialPopupReducer'
import { modelLoader } from '../../utils/modelLoader'
import { changeLogoTopIconsVisibility } from '../../redux/reducers/logoTopIconsReducer'

const Tower_Model = () => {
  const canvasData = useThree()
  const dispatch = useDispatch()
  const allIntersectionMeshes = []

  const gltf = modelLoader(import.meta.env.VITE_API_URL + 'Laptop.glb')

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
      {/* Labels uses about 100FPS */}
      <LabelsDynamic allIntersectionMeshes={allIntersectionMeshes} />
    </>
  )
}

export default Tower_Model
