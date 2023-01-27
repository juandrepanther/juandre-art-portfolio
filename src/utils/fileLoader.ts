export function fileLoader(
  type: 'slides' | 'video' | 'document',
  path: string,
  firstSlide?: number,
  lastSlide?: number
) {
  if (type === 'slides') {
    if (path && !firstSlide) {
      return `https://spp-microsites-assets.s3-accelerate.amazonaws.com/spp-igd-3d-interactive${path}`
    }
    if (firstSlide && lastSlide) {
      let urlsArray = []
      for (let index = firstSlide; index <= lastSlide; index++) {
        urlsArray.push(
          `https://spp-microsites-assets.s3-accelerate.amazonaws.com/spp-igd-3d-interactive${path}/Slide${index}.webp`
        )
      }
      return urlsArray
    }
  }
  if (type === 'video' || type === 'document')
    return `https://spp-microsites-assets.s3-accelerate.amazonaws.com/spp-igd-3d-interactive${path}`

  return
}
