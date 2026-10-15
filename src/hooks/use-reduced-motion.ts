import { useEffect, useState } from 'react'

function getInitialReducedMotionPreference() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function useReducedMotion() {
  const [isReducedMotion, setIsReducedMotion] = useState(
    getInitialReducedMotionPreference
  )

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent) => {
      setIsReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isReducedMotion
}

export default useReducedMotion
