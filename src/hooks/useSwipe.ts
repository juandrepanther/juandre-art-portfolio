import { useEffect, useState } from 'react'

type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null

function useSwipe(): SwipeDirection {
  const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null)
  let touchStartX = 0
  let touchStartY = 0
  let touchEndX = 0
  let touchEndY = 0

  const handleTouchStart = (e: TouchEvent): void => {
    touchStartX = e.changedTouches[0].screenX
    touchStartY = e.changedTouches[0].screenY
  }

  const handleTouchMove = (e: TouchEvent): void => {
    touchEndX = e.changedTouches[0].screenX
    touchEndY = e.changedTouches[0].screenY
  }

  const handleTouchEnd = (): void => {
    if (touchEndX < touchStartX - 50) {
      setSwipeDirection('left')
    } else if (touchEndX > touchStartX + 50) {
      setSwipeDirection('right')
    } else if (touchEndY < touchStartY - 50) {
      setSwipeDirection('up')
    } else if (touchEndY > touchStartY + 50) {
      setSwipeDirection('down')
    } else {
      setSwipeDirection(null)
    }
  }

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return swipeDirection
}

export default useSwipe
