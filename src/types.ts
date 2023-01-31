import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Vector3 } from 'three/src/math/Vector3'

export type cameraTargetsTypes = {
  object_1: Vector3
  object_2: Vector3
  object_3: Vector3
}

export type sideType =
  | 'frontSide'
  | 'backSide'
  | 'frontRight'
  | 'frontLeft'
  | 'frontCenter'
  | 'backLeft'
  | ''

export type documentsUrlsType = {
  title: string
  url: string | any[]
}

export type linksType = {
  title: string
  link: string
  videoDuration?: number
}

export type externalContentType = {
  documentsUrls?: documentsUrlsType[]
  links?: linksType[]
}

export type SubTriggersType = {
  id: number
  type: 'slides' | 'video' | 'none'
  position: [x: number, y: number, z: number]
  cameraSide: sideType
  subLabelTooltipTitle?: string
  data?: {
    parameters?: {
      isPlaying?: boolean
      isMuted?: boolean
      videoProgress?: number
      videoDuration?: number
      isVideoThumbnail?: string
      isSlidesThumbnail?: string
    }
    content: string[] | linksType[] | any
    externalContent?: externalContentType
    currentSlide?: number
    currentVideo?: number
  }
}

export type ContentDataType = {
  id: number
  type?: string
  position: [x: number, y: number, z: number]
  cameraSide: sideType
  subTriggers?: SubTriggersType[]
  labelTooltipTitle?: string
  data?: {
    parameters?: {
      isPlaying?: boolean
      isMuted?: boolean
      videoProgress?: number
      videoDuration?: number
      isVideoThumbnail?: string
      isSlidesThumbnail?: string
    }
    content: string[] | linksType[] | any
    externalContent?: externalContentType
    currentSlide?: number
    currentVideo?: number
  }
}

export interface IModelValidator {
  isNotBuildingMesh?: boolean
  currentBuildingType?: string
  isRoom01?: boolean
  isRoom02?: boolean
  isRoom03?: boolean
  isRoom04?: boolean
  isRoom05?: boolean
  isBuildingModel?: boolean
  isVoid?: boolean
  isBuilding?: boolean
  BakedRoom01?: any
  BakedRoom02?: any
  BakedRoom03?: any
  BakedRoom04?: any
  BakedRoom05?: any
  BakedBuilding?: any
  BakedVOID?: any
  isGltf?: any
  scene?: any
}

export interface ITower_Model {
  isWireframe?: boolean
}

export interface IDebugger {
  color?: string
  size?: [x: number, y: number, z: number]
}

export interface ICamera {
  zoom?: boolean
  pos?: Vector3
  look?: Vector3
}

export interface ISlide {
  position: number[]
  slidesUrls: string[]
  isThumbnailRequired?: any
  subLabelID: number
  cameraSide: sideType
}

export interface IVideoPlayer {
  position: number[]
  videoUrls: string[] | linksType[]
  isThumbnailRequired?: any
  subLabelID: number
  cameraSide: sideType
}

export type IRoomCharacters = {
  charactersPath: string
  roomID: number
}

export type GLTFResult = GLTF & {
  nodes: {
    ['2_Up_1']: THREE.Mesh
    ['2_Down_3']: THREE.Mesh
    ['3_Up_3']: THREE.Mesh
    ['3_Down_2']: THREE.Mesh
    ['3_Down_4']: THREE.Mesh
    ['2_Up_2']: THREE.Mesh
    ['2_Down_2']: THREE.Mesh
    ['3_Up_4']: THREE.Mesh
    ['3_Down_1']: THREE.Mesh
    ['3_Down_3']: THREE.Mesh
    ['3_Down_6']: THREE.Mesh
    ['2_Up_3']: THREE.Mesh
    ['2_Down_1']: THREE.Mesh
    ['3_Up_2']: THREE.Mesh
    ['3_Up_1']: THREE.Mesh
    ['3_Down_5']: THREE.Mesh
    Main: THREE.Mesh
  }
  materials: {
    Basic: THREE.MeshStandardMaterial
  }
}

export type GLTFActions = Record<ActionName, THREE.AnimationAction>

export type ActionName =
  | '2_Up_1Action'
  | '2_Up_2Action'
  | '2_Up_3Action'
  | '2_Down_1Action'
  | '2_Down_2Action'
  | '2_Down'
  | '3_Up'
  | '3_Up_2Action'
  | '3_Up_3Action'
  | '3_Up_1Action'
  | '3_Down_1Action'
  | '3_Down_2Action'
  | '3_Down_3Action'
  | '3_Down_4Action'
  | '3_Down_5Action'
  | '3_Down'
