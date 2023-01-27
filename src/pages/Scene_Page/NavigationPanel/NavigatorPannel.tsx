import React, { useEffect, useRef } from 'react'
import RoomChangeArrows from './parts/RoomChangeArrows'
import { Box } from '@mui/material'

//@MAIN FUNCTION

function NavigatorPannel() {
  //@FOCUS NAVIGATION PANEL ON START FOR KEYBOARD EVENTS
  const NavigationPanelRef = useRef(null)

  useEffect(() => {
    NavigationPanelRef.current.focus()
  }, [NavigationPanelRef])

  //@MAIN RENDER PANEL BOX

  return (
    <Box
      ref={NavigationPanelRef}
      tabIndex={-1}
      id="navigator-container"
      className="navigator-container"
      sx={{
        height: { xs: 'initial', sm: 'initial', md: 'initial', lg: '5rem' }
      }}
    >
      <div className="right-section fullyCenterHorizontal">
        <RoomChangeArrows />
      </div>
    </Box>
  )
}

export default NavigatorPannel
