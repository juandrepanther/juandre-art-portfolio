import { Billboard, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { RefObject } from 'react'
import type { Group, Vector3 } from 'three'
import {
  FLOATING_COMBAT_TEXT_DAMAGE_COLOR,
  FLOATING_COMBAT_TEXT_HEAL_COLOR,
  FLOATING_COMBAT_TEXT_TNT_COLOR,
  FLOATING_COMBAT_TEXT_POOL_SIZE,
  PLAYER_COMBAT_TEXT_HEAD_OFFSET
} from '../../settings'
import type {
  IFloatingCombatTextState,
  TFloatingCombatTextSource
} from '../types'
import { formatFloatingCombatTextValue } from '../helpers'

interface IFloatingCombatText {
  floatingCombatTextStateRef: RefObject<IFloatingCombatTextState[]>
  playerPositionRef: RefObject<Vector3>
}

const sourceColorMap: Record<TFloatingCombatTextSource, string> = {
  enemy: FLOATING_COMBAT_TEXT_DAMAGE_COLOR,
  painkiller: FLOATING_COMBAT_TEXT_HEAL_COLOR,
  tnt: FLOATING_COMBAT_TEXT_TNT_COLOR
}

export function FloatingCombatText({
  floatingCombatTextStateRef,
  playerPositionRef
}: IFloatingCombatText) {
  return (
    <group>
      {Array.from({ length: FLOATING_COMBAT_TEXT_POOL_SIZE }, (_, index) => (
        <FloatingCombatTextItem
          floatingCombatTextStateRef={floatingCombatTextStateRef}
          index={index}
          key={`floating-combat-text-${index}`}
          playerPositionRef={playerPositionRef}
        />
      ))}
    </group>
  )
}

interface IFloatingCombatTextItem {
  floatingCombatTextStateRef: RefObject<IFloatingCombatTextState[]>
  index: number
  playerPositionRef: RefObject<Vector3>
}

function FloatingCombatTextItem({
  floatingCombatTextStateRef,
  index,
  playerPositionRef
}: IFloatingCombatTextItem) {
  const billboardRef = useRef<Group | null>(null)
  const labelRef = useRef<HTMLDivElement | null>(null)

  useFrame(() => {
    const floatingCombatTextState = floatingCombatTextStateRef.current[index]

    if (
      !floatingCombatTextState ||
      !billboardRef.current ||
      !labelRef.current
    ) {
      return
    }

    if (
      !floatingCombatTextState.active ||
      floatingCombatTextState.maxTtl <= 0
    ) {
      billboardRef.current.visible = false
      return
    }

    const playerPosition = playerPositionRef.current
    const opacity = Math.max(
      0,
      Math.min(1, floatingCombatTextState.ttl / floatingCombatTextState.maxTtl)
    )

    billboardRef.current.visible = true
    billboardRef.current.position.set(
      playerPosition.x + floatingCombatTextState.position.x,
      playerPosition.y +
        PLAYER_COMBAT_TEXT_HEAD_OFFSET +
        floatingCombatTextState.position.y,
      playerPosition.z + floatingCombatTextState.position.z
    )

    labelRef.current.textContent = formatFloatingCombatTextValue(
      floatingCombatTextState.value
    )
    labelRef.current.style.color =
      sourceColorMap[floatingCombatTextState.source]
    labelRef.current.style.opacity = String(opacity)
    labelRef.current.style.transform = `scale(${0.9 + opacity * 0.2})`
  })

  return (
    <Billboard
      follow
      lockX={false}
      lockY={false}
      lockZ={false}
      ref={billboardRef}
      visible={false}
    >
      <Html center style={{ pointerEvents: 'none' }} zIndexRange={[120, 0]}>
        <div
          data-testid="floating-combat-text"
          ref={labelRef}
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '0.03em',
            textShadow: '0 0 16px rgba(0, 0, 0, 0.72)',
            userSelect: 'none',
            whiteSpace: 'nowrap'
          }}
        />
      </Html>
    </Billboard>
  )
}
