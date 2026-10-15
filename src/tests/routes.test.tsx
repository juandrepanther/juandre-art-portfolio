import { MemoryRouter } from 'react-router'
import { screen } from 'shadow-dom-testing-library'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from './tests-helpers'

vi.mock('../pages/home-page/home-page', () => ({
  default: function MockHomePage() {
    return <div>Mock Home Route</div>
  }
}))

vi.mock('../pages/Maze_Page/Maze_Page', () => ({
  default: function MockMazePage() {
    return <div>Mock Maze Route</div>
  }
}))

async function importRouter(isWebGLSupported: boolean) {
  vi.doMock('../utils/WebGL', () => ({
    default: {
      isWebGL2Available: () => isWebGLSupported,
      isWebGLAvailable: () => isWebGLSupported
    }
  }))

  return import('../routes')
}

describe('routes', () => {
  afterEach(() => {
    vi.resetModules()
  })

  it('renders the home route at the root path', async () => {
    const { AppRoutes } = await importRouter(true)

    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(await screen.findByText('Mock Home Route')).toBeInTheDocument()
  })

  it('renders the maze fallback when WebGL is unavailable', async () => {
    const { AppRoutes } = await importRouter(false)

    renderWithProviders(
      <MemoryRouter initialEntries={['/maze-game']}>
        <AppRoutes />
      </MemoryRouter>
    )

    expect(
      await screen.findByText(/webgl is not supported on your device/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/maze game requires canvas support to run correctly/i)
    ).toBeInTheDocument()
  })
})
