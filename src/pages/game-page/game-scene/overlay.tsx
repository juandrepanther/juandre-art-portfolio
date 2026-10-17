import { Billboard, Html } from '@react-three/drei'

export function GameSceneInstructions() {
  return (
    <Billboard
      follow
      lockX={false}
      lockY={false}
      lockZ={false}
      position={[0, 6.8, -2]}
    >
      <Html center>
        <div
          style={{
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: '999px',
            color: '#234038',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '14px',
            letterSpacing: '0.06em',
            padding: '14px 22px',
            backdropFilter: 'blur(12px)',
            background: 'rgba(244, 252, 248, 0.72)',
            width: 'min(90vw, 480px)'
          }}
        >
          Valhalla is waiting for you!
        </div>
      </Html>
    </Billboard>
  )
}
