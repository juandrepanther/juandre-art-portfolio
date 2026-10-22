import { screen } from 'shadow-dom-testing-library'
import { describe, expect, it } from 'vitest'
import WebglNotSupportedPage from 'pages/webgl-not-supported-page/webgl-not-supported-page'
import { renderWithProviders } from './tests-helpers'

describe('WebglNotSupportedPage', () => {
  it('renders the compatibility notice and actions', () => {
    renderWithProviders(<WebglNotSupportedPage />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'This browser cannot render WebGL scenes.'
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })
})
