import { render } from '@testing-library/react'
import { screen } from 'shadow-dom-testing-library'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import PlayerHealthMeter from 'pages/game-page/game-scene/player-health-meter'

vi.mock('@react-three/drei', () => ({
  Billboard: ({ children }: { children: ReactNode }) => (
    <div data-testid="billboard">{children}</div>
  ),
  Html: ({ children, ...props }: { children: ReactNode }) => (
    <div data-testid="html" {...props}>
      {children}
    </div>
  )
}))

describe('PlayerHealthMeter', () => {
  it('renders the current health as progress and text', () => {
    render(<PlayerHealthMeter health={65} playerName="Lena" />)

    const progressbar = screen.getByRole('progressbar', { name: /health 65%/i })
    const fill = screen.getByTestId('player-health-meter-fill')

    expect(progressbar).toHaveAttribute('aria-valuenow', '65')
    expect(progressbar).toHaveAttribute('data-health-tone', 'healthy')
    expect(fill).toHaveStyle({ width: '65%' })
    expect(screen.getByText('Lena')).toBeInTheDocument()
    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('switches to the critical variant at low health', () => {
    render(<PlayerHealthMeter health={20} playerName="Lena" />)

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'data-health-tone',
      'critical'
    )
    expect(screen.getByTestId('player-health-meter-fill')).toHaveStyle({
      width: '20%'
    })
  })

  it('clamps out-of-range health values', () => {
    const { rerender } = render(
      <PlayerHealthMeter health={140} playerName="Lena" />
    )

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100'
    )
    expect(screen.getByTestId('player-health-meter-fill')).toHaveStyle({
      width: '100%'
    })

    rerender(<PlayerHealthMeter health={-5} playerName="Lena" />)

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '0'
    )
    expect(screen.getByTestId('player-health-meter-fill')).toHaveStyle({
      width: '0%'
    })
  })
})
