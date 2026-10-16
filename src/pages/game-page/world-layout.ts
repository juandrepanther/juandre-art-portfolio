export type TWorldPosition = [number, number, number]

export interface ITreeLayout {
  monkeyPosition: TWorldPosition
  treePosition: TWorldPosition
}

export interface ICrateLayout {
  position: TWorldPosition
  rotationY: number
  size: [number, number, number]
}

export const GAME_ARENA_HALF_SIZE = 38
export const GAME_GROUND_SIZE = 104
export const GAME_FOG_NEAR = 22
export const GAME_FOG_FAR = 88
export const ARENA_BOUNDARY_COLLIDER_HEIGHT = 8
export const ARENA_BOUNDARY_COLLIDER_THICKNESS = 2
export const TREE_TRUNK_COLLIDER_ARGS: [number, number, number] = [0.85, 1.95, 0.85]

export const PLAYER_START_POSITION: TWorldPosition = [0, 1.1, 23]

export const TREE_LAYOUTS: ITreeLayout[] = [
  {
    treePosition: [-28, 0, -24],
    monkeyPosition: [-28.9, 2.5, -25.1]
  },
  {
    treePosition: [-12, 0, -28],
    monkeyPosition: [-12.8, 2.4, -29]
  },
  {
    treePosition: [10, 0, -30],
    monkeyPosition: [9.3, 2.45, -31.1]
  },
  {
    treePosition: [28, 0, -22],
    monkeyPosition: [27.2, 2.35, -23.1]
  },
  {
    treePosition: [-31, 0, -4],
    monkeyPosition: [-31.8, 2.5, -5]
  },
  {
    treePosition: [30, 0, -2],
    monkeyPosition: [29.3, 2.45, -3]
  },
  {
    treePosition: [-24, 0, 16],
    monkeyPosition: [-24.9, 2.55, 15.2]
  },
  {
    treePosition: [-5, 0, 24],
    monkeyPosition: [-5.8, 2.4, 23.1]
  },
  {
    treePosition: [14, 0, 18],
    monkeyPosition: [13.3, 2.5, 17.2]
  },
  {
    treePosition: [31, 0, 12],
    monkeyPosition: [30.2, 2.45, 11]
  },
  {
    treePosition: [-18, 0, 32],
    monkeyPosition: [-18.9, 2.45, 31.2]
  },
  {
    treePosition: [20, 0, 31],
    monkeyPosition: [19.2, 2.45, 30.2]
  }
]

export const BOX_LAYOUTS: ICrateLayout[] = [
  {
    position: [-20, 0.9, -14],
    rotationY: 0.18,
    size: [2.4, 1.8, 2.1]
  },
  {
    position: [-7, 0.75, -18],
    rotationY: -0.42,
    size: [1.8, 1.5, 1.8]
  },
  {
    position: [8, 0.9, -16],
    rotationY: 0.3,
    size: [2.2, 1.8, 2.2]
  },
  {
    position: [22, 0.8, -10],
    rotationY: -0.2,
    size: [2, 1.6, 2]
  },
  {
    position: [-24, 0.9, 2],
    rotationY: -0.36,
    size: [2.4, 1.8, 2]
  },
  {
    position: [-9, 0.85, 6],
    rotationY: 0.52,
    size: [2.1, 1.7, 2.1]
  },
  {
    position: [6, 0.75, 4],
    rotationY: -0.18,
    size: [1.9, 1.5, 1.9]
  },
  {
    position: [24, 0.95, 5],
    rotationY: 0.66,
    size: [2.5, 1.9, 2.2]
  },
  {
    position: [-28, 0.8, 22],
    rotationY: 0.24,
    size: [2.1, 1.6, 1.9]
  },
  {
    position: [-10, 0.95, 28],
    rotationY: -0.48,
    size: [2.5, 1.9, 2.4]
  },
  {
    position: [9, 0.8, 24],
    rotationY: 0.16,
    size: [2, 1.6, 2]
  },
  {
    position: [27, 0.85, 26],
    rotationY: -0.28,
    size: [2.2, 1.7, 2.2]
  }
]
