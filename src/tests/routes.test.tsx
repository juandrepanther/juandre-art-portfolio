import { MemoryRouter } from 'react-router'
import { screen } from 'shadow-dom-testing-library'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from './tests-helpers'

vi.mock('../pages/home-page/home-page', () => ({
  default: function MockHomePage() {
    return <div>Mock Home Route</div>
  }
}))

vi.mock('../pages/error-page/error-page', () => ({
  default: function MockErrorPage() {
    return <div>Mock Error Route</div>
  }
}))

async function importRouter() {
  return import('../routes')
}

describe('routes', () => {
  afterEach(() => {
    vi.resetModules()
  })

  it('renders the home route at the root path', async () => {
    const { AppRoutes } = await importRouter()

    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(await screen.findByText('Mock Home Route')).toBeInTheDocument()
  })

  it('renders the error route for unknown paths', async () => {
    const { AppRoutes } = await importRouter()

    renderWithProviders(
      <MemoryRouter initialEntries={['/missing-route']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(await screen.findByText('Mock Error Route')).toBeInTheDocument()
  })
})
