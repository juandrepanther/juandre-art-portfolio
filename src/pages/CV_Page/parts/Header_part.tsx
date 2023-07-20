import { Box, Tooltip } from '@mui/material'
import React from 'react'
import { displayFlexCenterColumn } from '../../../utils/globalStyles'

function Header_part() {
  return (
    <Box className="header-part" sx={displayFlexCenterColumn}>
      <header style={{ fontSize: '4rem', fontWeight: 700 }}>
        JANIS DREGERIS
      </header>
      <Box
        sx={{
          backgroundColor: 'black',
          color: 'white',
          p: '.6rem',
          letterSpacing: '.5rem',
          mt: '.5rem'
        }}
      >
        <p style={{ fontWeight: 300 }}>FULL-STACK WEB DEVELOPER</p>
      </Box>
      <Tooltip placement="bottom" title="You are already here.">
        <p style={{ fontSize: '1.5rem', fontWeight: 300, marginTop: '.7rem' }}>
          https://juandrepanther.github.io/juandre-art-portfolio/
        </p>
      </Tooltip>
    </Box>
  )
}

export default Header_part
