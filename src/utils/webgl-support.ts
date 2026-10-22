const WEBGL_CONTEXT_NAMES = ['webgl2', 'webgl', 'experimental-webgl']

export function isWebGLSupported() {
  if (typeof document === 'undefined') {
    return true
  }

  try {
    const canvas = document.createElement('canvas')

    for (const contextName of WEBGL_CONTEXT_NAMES) {
      const context = canvas.getContext(contextName)

      if (context !== null) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}
