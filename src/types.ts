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

export type ContentDataType = {
  id: number
  type?: string
  position: [x: number, y: number, z: number]
  cameraSide: sideType
  labelTooltipTitle?: string
}

export interface ICamera {
  zoom?: boolean
  pos?: Vector3
  look?: Vector3
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
