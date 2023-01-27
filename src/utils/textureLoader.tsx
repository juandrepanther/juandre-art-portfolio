import * as THREE from 'three'

const textureLoader = (filename: string, format: 'webp' | 'png') => {
  const loader = new THREE.TextureLoader()

  return loader.load(
    `${
      process.env.NODE_ENV !== 'development'
        ? `/juandre-art-portfolio/maps/${filename}.${format}`
        : `/maps/${filename}.${format}`
    }`
  )
}

export default textureLoader
