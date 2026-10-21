import { useRef, useState, type PointerEvent } from 'react'

interface IJoystickVector {
  x: number
  y: number
}

interface IMobileControlsOverlay {
  onJumpPress: () => void
  onLookDelta: (deltaX: number, deltaY: number) => void
  onMoveChange: (vector: IJoystickVector) => void
  onShootPress: () => void
}

const joystickMaxDistance = 44

function clampVectorToRadius(x: number, y: number, maxDistance: number) {
  const distance = Math.hypot(x, y)

  if (distance <= maxDistance || distance === 0) {
    return { x, y }
  }

  const ratio = maxDistance / distance

  return {
    x: x * ratio,
    y: y * ratio
  }
}

function MobileControlsOverlay({
  onJumpPress,
  onLookDelta,
  onMoveChange,
  onShootPress
}: IMobileControlsOverlay) {
  const joystickPointerIdRef = useRef<number | null>(null)
  const lookPointerIdRef = useRef<number | null>(null)
  const lookLastPointRef = useRef({ x: 0, y: 0 })
  const [joystickKnob, setJoystickKnob] = useState<IJoystickVector>({
    x: 0,
    y: 0
  })

  const updateJoystickFromPoint = (
    clientX: number,
    clientY: number,
    container: HTMLElement
  ) => {
    const bounds = container.getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2
    const centerY = bounds.top + bounds.height / 2
    const clamped = clampVectorToRadius(
      clientX - centerX,
      clientY - centerY,
      joystickMaxDistance
    )

    setJoystickKnob(clamped)
    onMoveChange({
      x: clamped.x / joystickMaxDistance,
      y: clamped.y / joystickMaxDistance
    })
  }

  const handleJoystickPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    joystickPointerIdRef.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
    updateJoystickFromPoint(e.clientX, e.clientY, e.currentTarget)
  }

  const handleJoystickPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (joystickPointerIdRef.current !== e.pointerId) {
      return
    }

    updateJoystickFromPoint(e.clientX, e.clientY, e.currentTarget)
  }

  const resetJoystick = () => {
    joystickPointerIdRef.current = null
    setJoystickKnob({ x: 0, y: 0 })
    onMoveChange({ x: 0, y: 0 })
  }

  const handleLookPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    lookPointerIdRef.current = e.pointerId
    lookLastPointRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleLookPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (lookPointerIdRef.current !== e.pointerId) {
      return
    }

    const lastPoint = lookLastPointRef.current
    const deltaX = e.clientX - lastPoint.x
    const deltaY = e.clientY - lastPoint.y

    lookLastPointRef.current = { x: e.clientX, y: e.clientY }
    onLookDelta(deltaX, deltaY)
  }

  const resetLook = () => {
    lookPointerIdRef.current = null
    lookLastPointRef.current = { x: 0, y: 0 }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 120,
        touchAction: 'none'
      }}
    >
      <div
        onPointerCancel={resetLook}
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={resetLook}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '64%',
          height: 'calc(100% - 120px)',
          pointerEvents: 'auto',
          zIndex: 1
        }}
      />

      <div
        onPointerCancel={resetJoystick}
        onPointerDown={handleJoystickPointerDown}
        onPointerMove={handleJoystickPointerMove}
        onPointerUp={resetJoystick}
        style={{
          position: 'absolute',
          left: 'max(10px, env(safe-area-inset-left))',
          bottom: 'max(10px, env(safe-area-inset-bottom))',
          width: 86,
          height: 86,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.62)',
          background: 'rgba(0,0,0,0.26)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.26)',
          backdropFilter: 'blur(6px)',
          pointerEvents: 'auto',
          zIndex: 3
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.72)',
            background: 'rgba(255,255,255,0.42)',
            transform: `translate(calc(-50% + ${joystickKnob.x}px), calc(-50% + ${joystickKnob.y}px))`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.26)'
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 'max(10px, env(safe-area-inset-right))',
          bottom: 'max(10px, env(safe-area-inset-bottom))',
          display: 'grid',
          gap: 8,
          pointerEvents: 'auto',
          zIndex: 4
        }}
      >
        <button
          aria-label="Jump"
          onPointerDown={onJumpPress}
          style={{
            width: 72,
            height: 36,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.7)',
            color: '#f8fbff',
            background: 'rgba(0,0,0,0.36)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)'
          }}
          type="button"
        >
          Jump
        </button>
        <button
          aria-label="Shoot"
          onPointerDown={onShootPress}
          style={{
            width: 72,
            height: 36,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.7)',
            color: '#f8fbff',
            background: 'rgba(255,80,52,0.72)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            backdropFilter: 'blur(4px)'
          }}
          type="button"
        >
          Shoot
        </button>
      </div>
    </div>
  )
}

export default MobileControlsOverlay
