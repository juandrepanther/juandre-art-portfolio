import type { ICrateLayout } from './world-layout'

export function isPointInsideCrate(
  point: [number, number, number],
  crate: ICrateLayout,
  padding = 0
) {
  const [pointX, pointY, pointZ] = point
  const [crateX, crateY, crateZ] = crate.position
  const [width, height, depth] = crate.size
  const deltaX = pointX - crateX
  const deltaZ = pointZ - crateZ
  const cosine = Math.cos(crate.rotationY)
  const sine = Math.sin(crate.rotationY)
  const localX = deltaX * cosine + deltaZ * sine
  const localZ = -deltaX * sine + deltaZ * cosine
  const halfWidth = width / 2 + padding
  const halfHeight = height / 2 + padding
  const halfDepth = depth / 2 + padding

  return (
    Math.abs(localX) <= halfWidth &&
    Math.abs(localZ) <= halfDepth &&
    pointY >= crateY - halfHeight &&
    pointY <= crateY + halfHeight
  )
}

export function isPointInsideAnyCrate(
  point: [number, number, number],
  crates: ICrateLayout[]
) {
  return crates.some((crate) => isPointInsideCrate(point, crate))
}
