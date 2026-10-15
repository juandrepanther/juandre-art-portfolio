import { useEffect, useRef, useState } from 'react'

type SwipeDirection = 'up' | 'down' | 'left' | 'right' | 'reset' | null

function useSwipe(): SwipeDirection {
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchEndX = useRef(0)
  const touchEndY = useRef(0)
  const lastTouchEndTime = useRef(0)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent): void => {
      touchStartX.current = e.changedTouches[0].screenX
      touchStartY.current = e.changedTouches[0].screenY
    }

    const handleTouchMove = (e: TouchEvent): void => {
      touchEndX.current = e.changedTouches[0].screenX
      touchEndY.current = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (): void => {
      const currentTime = Date.now()
      const timeSinceLastTouch = currentTime - lastTouchEndTime.current

      if (timeSinceLastTouch < 300 && timeSinceLastTouch > 0) {
        setSwipeDirection('reset')
      } else if (touchEndX.current < touchStartX.current - 50) {
        setSwipeDirection('left')
      } else if (touchEndX.current > touchStartX.current + 50) {
        setSwipeDirection('right')
      } else if (touchEndY.current < touchStartY.current - 50) {
        setSwipeDirection('up')
      } else if (touchEndY.current > touchStartY.current + 50) {
        setSwipeDirection('down')
      } else {
        setSwipeDirection(null)
      }

      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }

      resetTimer.current = setTimeout(() => {
        setSwipeDirection(null)
      }, 500)

      lastTouchEndTime.current = currentTime
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)

      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }
    }
  }, [])

  return swipeDirection
}

export default useSwipe
