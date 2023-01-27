import { Box } from '@mui/material'
import React from 'react'
import ScreenRotationIcon from '@mui/icons-material/ScreenRotation'

function MobileVerticalMessage() {
  //reload Btn handler

  const reloadPage = () => window.location.reload()

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        gap: '2rem',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          lineHeight: '2.5rem',
          fontSize: '2rem',
          p: '1rem',
          letterSpacing: '0.2rem'
        }}
      >
        Tilt | Landscape
      </Box>
      <Box className="rotate">
        <ScreenRotationIcon sx={{ fontSize: '5rem' }} />
      </Box>

      <Box className="button-container" onClick={reloadPage}>
        <div id="left-border"></div>
        <div id="top-border"></div>
        <Box className="button">Refresh the Page</Box>
        <div id="bottom-border"></div>
        <div id="right-border"></div>
      </Box>
    </div>
  )
}

export default MobileVerticalMessage
