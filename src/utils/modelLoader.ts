import { useLoader } from '@react-three/fiber'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const modelLoader = (modelUrl: string) => {
  const loadedModel: any = useLoader(GLTFLoader, modelUrl, (loader: any) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
      `${
        process.env.NODE_ENV !== 'development'
          ? '/juandre-art-portfolio/draco/gltf/'
          : '/draco/gltf/'
      }`
    )
    loader.setDRACOLoader(dracoLoader)
  })
  return loadedModel
}
