import { AnimatedSurfaceMaterial } from '../lighting'
import type { TTreeVariant } from '../types'

interface IEvergreenTree {
  variant: TTreeVariant
}

export function EvergreenTree({ variant }: IEvergreenTree) {
  switch (variant) {
    case 0:
      return (
        <>
          <mesh position={[0, 1.75, 0]}>
            <cylinderGeometry args={[0.35, 0.58, 3.5, 8]} />
            <meshStandardMaterial color="#8c6141" roughness={0.9} />
          </mesh>
          <mesh position={[0, 4.2, 0]}>
            <coneGeometry args={[2.1, 4.2, 12]} />
            <AnimatedSurfaceMaterial
              accentColor="#c8f2d7"
              amplitude={0.08}
              baseColor="#78bb89"
            />
          </mesh>
          <mesh position={[0.52, 3.45, 0.4]}>
            <sphereGeometry args={[1.08, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#cdebc0"
              amplitude={0.06}
              baseColor="#6ba86f"
            />
          </mesh>
        </>
      )
    case 1:
      return (
        <>
          <mesh position={[0, 1.55, 0]} rotation={[0.08, 0, -0.08]}>
            <cylinderGeometry args={[0.26, 0.52, 3.1, 7]} />
            <meshStandardMaterial color="#8a6040" roughness={0.94} />
          </mesh>
          <mesh position={[0.18, 3.15, 0]} rotation={[0.06, 0.16, 0.04]}>
            <coneGeometry args={[1.55, 2.3, 10]} />
            <AnimatedSurfaceMaterial
              accentColor="#d0efcb"
              amplitude={0.07}
              baseColor="#77af7d"
            />
          </mesh>
          <mesh position={[-0.35, 4.2, -0.1]} rotation={[-0.08, 0.4, -0.06]}>
            <coneGeometry args={[1.18, 1.95, 10]} />
            <AnimatedSurfaceMaterial
              accentColor="#d7efc9"
              amplitude={0.05}
              baseColor="#8ec387"
            />
          </mesh>
          <mesh position={[0.52, 2.7, 0.12]} rotation={[0.4, 0.1, 0.86]}>
            <cylinderGeometry args={[0.07, 0.09, 1.15, 6]} />
            <meshStandardMaterial color="#8c6141" roughness={0.95} />
          </mesh>
        </>
      )
    default:
      return (
        <>
          <mesh position={[0, 1.9, 0]}>
            <cylinderGeometry args={[0.42, 0.68, 3.8, 9]} />
            <meshStandardMaterial color="#8e6648" roughness={0.9} />
          </mesh>
          <mesh position={[0, 4.1, 0]}>
            <sphereGeometry args={[1.5, 18, 18]} />
            <AnimatedSurfaceMaterial
              accentColor="#c4ecd0"
              amplitude={0.05}
              baseColor="#74b07d"
            />
          </mesh>
          <mesh position={[-0.9, 3.72, 0.24]}>
            <sphereGeometry args={[0.92, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#d1eec3"
              amplitude={0.04}
              baseColor="#6ba86f"
            />
          </mesh>
          <mesh position={[0.88, 3.54, -0.08]}>
            <sphereGeometry args={[1, 16, 16]} />
            <AnimatedSurfaceMaterial
              accentColor="#c8f2d7"
              amplitude={0.04}
              baseColor="#78bb89"
            />
          </mesh>
        </>
      )
  }
}
