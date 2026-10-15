import type { Mesh, MeshStandardMaterial } from 'three'

export interface IGLTFResult {
  nodes: {
    ['2_Up_1']: Mesh
    ['2_Down_3']: Mesh
    ['3_Up_3']: Mesh
    ['3_Down_2']: Mesh
    ['3_Down_4']: Mesh
    ['2_Up_2']: Mesh
    ['2_Down_2']: Mesh
    ['3_Up_4']: Mesh
    ['3_Down_1']: Mesh
    ['3_Down_3']: Mesh
    ['3_Down_6']: Mesh
    ['2_Up_3']: Mesh
    ['2_Down_1']: Mesh
    ['3_Up_2']: Mesh
    ['3_Up_1']: Mesh
    ['3_Down_5']: Mesh
    Main: Mesh
  }
  materials: {
    Basic: MeshStandardMaterial
  }
}
