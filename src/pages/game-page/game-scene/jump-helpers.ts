interface IJumpApexY {
  jumpStartY: number
  jumpVelocity: number
  gravity: number
}

interface ICanUseAirJumpNearApex {
  apexZoneRatio: number
  currentY: number
  gravity: number
  jumpStartY: number
  jumpVelocity: number
}

export function getJumpApexY({
  jumpStartY,
  jumpVelocity,
  gravity
}: IJumpApexY) {
  if (gravity <= 0 || jumpVelocity <= 0) {
    return jumpStartY
  }

  const jumpHeight = (jumpVelocity * jumpVelocity) / (2 * gravity)

  return jumpStartY + jumpHeight
}

export function canUseAirJumpNearApex({
  apexZoneRatio,
  currentY,
  gravity,
  jumpStartY,
  jumpVelocity
}: ICanUseAirJumpNearApex) {
  if (apexZoneRatio <= 0 || apexZoneRatio > 1) {
    return false
  }

  const apexY = getJumpApexY({ gravity, jumpStartY, jumpVelocity })
  const jumpHeight = apexY - jumpStartY

  if (jumpHeight <= 0) {
    return false
  }

  const minAirJumpY = apexY - jumpHeight * apexZoneRatio

  return currentY >= minAirJumpY && currentY <= apexY
}
