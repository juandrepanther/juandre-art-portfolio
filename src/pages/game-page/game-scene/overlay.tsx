import { Billboard, Html } from '@react-three/drei'
import { useState } from 'react'
import quoteEntries from './quotes.json'

interface IQuoteEntry {
  text: string
  source: string
}

function getRandomQuote(entries: IQuoteEntry[]): IQuoteEntry {
  if (entries.length === 0) {
    return { text: '', source: '' }
  }

  const randomIndex = Math.floor(Math.random() * entries.length)

  return entries[randomIndex] ?? entries[0]
}

export function GameSceneInstructions() {
  const [quote] = useState(() => getRandomQuote(quoteEntries))

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
            textAlign: 'center',
            width: 'min(90vw, 480px)'
          }}
        >
          <div style={{ fontSize: '15px', letterSpacing: '0.03em' }}>
            {quote.text}
          </div>
          <div style={{ fontSize: '11px', marginTop: '8px', opacity: 0.8 }}>
            {quote.source}
          </div>
        </div>
      </Html>
    </Billboard>
  )
}
