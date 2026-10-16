import type { ICrateLayout } from './world-layout'

export interface ICirclePosition {
  x: number
  z: number
}

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

export function doesCircleIntersectCrate(
  circle: ICirclePosition,
  radius: number,
  crate: ICrateLayout,
  padding = 0
) {
  const [crateX, , crateZ] = crate.position
  const [width, , depth] = crate.size
  const deltaX = circle.x - crateX
  const deltaZ = circle.z - crateZ
  const cosine = Math.cos(crate.rotationY)
  const sine = Math.sin(crate.rotationY)
  const localX = deltaX * cosine + deltaZ * sine
  const localZ = -deltaX * sine + deltaZ * cosine
  const halfWidth = width / 2 + padding
  const halfDepth = depth / 2 + padding
  const closestX = Math.max(-halfWidth, Math.min(localX, halfWidth))
  const closestZ = Math.max(-halfDepth, Math.min(localZ, halfDepth))
  const distanceX = localX - closestX
  const distanceZ = localZ - closestZ

  return distanceX * distanceX + distanceZ * distanceZ <= radius * radius
}

export function doesCircleIntersectAnyCrate(
  circle: ICirclePosition,
  radius: number,
  crates: ICrateLayout[],
  padding = 0
) {
  return crates.some((crate) =>
    doesCircleIntersectCrate(circle, radius, crate, padding)
  )
}

export function getCrateTopHeight(crate: ICrateLayout) {
  return crate.position[1] + crate.size[1] / 2
}

export function findHighestCrateTopUnderCircle(
  circle: ICirclePosition,
  radius: number,
  crates: ICrateLayout[],
  padding = 0
) {
  let highestTopHeight: number | null = null

  for (const crate of crates) {
    if (!doesCircleIntersectCrate(circle, radius, crate, padding)) {
      continue
    }

    const crateTopHeight = getCrateTopHeight(crate)

    if (highestTopHeight === null || crateTopHeight > highestTopHeight) {
      highestTopHeight = crateTopHeight
    }
  }

  return highestTopHeight
}
