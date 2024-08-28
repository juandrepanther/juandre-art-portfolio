import { sideType } from '../types'

function cameraSideApply(originalPosition: number[], cameraSide: sideType) {
  let correctPosition: number[]
  let correctRotation: number[]

  //@for rotation try to use 0, Math.PI, Math.PI / 2, Math.PI / -2

  if (cameraSide === 'frontCenter') {
    correctRotation = [0, 0, 0]
    correctPosition = [
      originalPosition[0],
      originalPosition[1],
      originalPosition[2] + 0.05
    ]
  }
  if (cameraSide === 'backSide') {
    correctRotation = [Math.PI, 0, Math.PI]
    correctPosition = [
      originalPosition[0],
      originalPosition[1],
      originalPosition[2] - 0.05
    ]
  }
  if (cameraSide === 'frontLeft') {
    correctRotation = [Math.PI / 2, -Math.PI / -2, Math.PI / -2]
    correctPosition = [
      originalPosition[0] + 0.05,
      originalPosition[1],
      originalPosition[2]
    ]
  }

  if (cameraSide === 'frontRight') {
    correctRotation = [-Math.PI / 2, -Math.PI / 2, -Math.PI / 2]
    correctPosition = [
      originalPosition[0] - 0.05,
      originalPosition[1],
      originalPosition[2]
    ]
  }
  return [correctPosition, correctRotation]
}

export default cameraSideApply
