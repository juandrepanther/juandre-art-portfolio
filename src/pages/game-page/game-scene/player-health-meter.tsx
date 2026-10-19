import { Billboard, Html } from '@react-three/drei'
import { MAX_HEALTH, PLAYER_HEALTH_METER_OFFSET } from '../settings'

interface IPlayerHealthMeter {
  health: number
}

function PlayerHealthMeter({ health }: IPlayerHealthMeter) {
  const clampedHealth = Math.max(0, Math.min(MAX_HEALTH, Math.round(health)))
  const isHealthy = clampedHealth > 40

  return (
    <Billboard
      follow
      lockX={false}
      lockY={false}
      lockZ={false}
      position={[1.3, PLAYER_HEALTH_METER_OFFSET, 0]}
    >
      <Html center style={{ pointerEvents: 'none' }}>
        <div
          aria-label={`Health ${clampedHealth}%`}
          aria-valuemax={MAX_HEALTH}
          aria-valuemin={0}
          aria-valuenow={clampedHealth}
          data-health-tone={isHealthy ? 'healthy' : 'critical'}
          role="progressbar"
          style={{
            width: '232px',
            padding: '8px 10px 10px',
            border: '1px solid rgba(255, 255, 255, 0.32)',
            borderRadius: '18px',
            background:
              'linear-gradient(180deg, rgba(12, 17, 23, 0.88) 0%, rgba(23, 33, 43, 0.74) 100%)',
            boxShadow: '0 18px 30px rgba(0, 0, 0, 0.28)',
            backdropFilter: 'blur(14px)',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '6px',
              color: '#f4fcf8',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase'
            }}
          >
            <span>HP</span>
            <span>{clampedHealth}%</span>
          </div>

          <div
            aria-hidden="true"
            style={{
              overflow: 'hidden',
              height: '9px',
              borderRadius: '999px',
              backgroundColor: 'rgba(220, 229, 236, 0.16)'
            }}
          >
            <div
              data-testid="player-health-meter-fill"
              style={{
                width: `${clampedHealth}%`,
                height: '100%',
                borderRadius: '999px',
                background: isHealthy
                  ? 'linear-gradient(90deg, #4cc9b0 0%, #9cf2dd 100%)'
                  : 'linear-gradient(90deg, #ff6b5f 0%, #ffd166 100%)',
                boxShadow: isHealthy
                  ? '0 0 14px rgba(76, 201, 176, 0.45)'
                  : '0 0 14px rgba(255, 107, 95, 0.35)',
                transition: 'width 160ms ease-out, background 160ms ease-out'
              }}
            />
          </div>
        </div>
      </Html>
    </Billboard>
  )
}

export default PlayerHealthMeter
