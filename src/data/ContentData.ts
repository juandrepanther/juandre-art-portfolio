import * as THREE from 'three'
import { ContentDataType } from '../types'

//@ VARIABLES & PROPERTIES

//Stats of GPU, CPU is located in the Tower_Model.tsx render.
//Keep in mind, that in this case it will cause the drop of maxFPS. In this case maxFPS value is incorrect.

export const developerMode = false
const modelScale_united = 14
export const modelScale = new THREE.Vector3(
  modelScale_united,
  modelScale_united,
  modelScale_united
)
export const TV_Scale = { width: 3.4, height: 1.9 }

export const lockedCamera_startPosition = [1, 5, -5]
export const lockedCamera_targetPosition = [0, 2, 0]
export const cameraDepthLimit = 60
export const distanceFromCameraToObject = 0.3

//@MAIN DATA TO MODIFY & CHANGE

const ContentData: ContentDataType[] = [
  {
    id: 1,
    position: [0.27, 0.44, 0.2],
    cameraSide: 'backSide',
    labelTooltipTitle: 'Explore my Curriculum vitae (CV).'
  },

  {
    id: 2,
    position: [-0.76, 1.27, 1.5],
    cameraSide: 'backSide',
    labelTooltipTitle: 'Want to contact me? Check my contacts here.'
  },
  {
    id: 3,
    position: [-1.44, 0.32, -0.43],
    cameraSide: 'backSide',
    labelTooltipTitle: 'PLAY a GAME: Dark Maze.'
  }
]

export default ContentData
