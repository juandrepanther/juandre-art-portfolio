import type { ReactNode } from 'react'
import { screen } from 'shadow-dom-testing-library'
import { describe, expect, it, vi } from 'vitest'
import ErrorPage from 'pages/error-page/error-page'
import { renderWithProviders } from './tests-helpers'

vi.mock('shaders/react', () => ({
  Prism: function MockPrism() {
    return null
  },
  Shader: function MockShader({ children }: { children: ReactNode }) {
    return <div>{children}</div>
  }
}))

describe('ErrorPage', () => {
  it('keeps the main copy white in dark mode', () => {
    renderWithProviders(<ErrorPage />, { isDarkMode: true })
    const renderedCss = document.head.innerHTML.replaceAll(' ', '')

    expect(
      screen.getByText('This page drifted out of orbit.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(renderedCss).toContain('color:#ffffff')
    expect(renderedCss).toContain('color:rgba(255,255,255,0.78)')
  })

  it('keeps the main copy white in light mode', () => {
    renderWithProviders(<ErrorPage />, { isDarkMode: false })
    const renderedCss = document.head.innerHTML.replaceAll(' ', '')

    expect(
      screen.getByText('This page drifted out of orbit.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(renderedCss).toContain('color:#ffffff')
    expect(renderedCss).toContain('color:rgba(255,255,255,0.78)')
  })
})
