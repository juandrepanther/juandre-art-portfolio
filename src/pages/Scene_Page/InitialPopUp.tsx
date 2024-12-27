import React from 'react'
import rotateImage from '../../assets/images/rotateImg.png'
import { useDispatch } from 'react-redux'
import { changeInitialPopupVisibility } from '../../redux/reducers/initialPopupReducer'
import { setSideBar_status } from '../../redux/reducers/sideBarReducer'
import { Box, Divider } from '@mui/material'

function InitialPopUp() {
  const dispatch = useDispatch()

  const hideInitialPopup = () => {
    dispatch(changeInitialPopupVisibility(false))
    dispatch(setSideBar_status(false))
  }

  return (
    <Box className="initialPopUp-container">
      <Box className="initialPopUp-blurred"></Box>
      <Box className="initialPopUp-content">
        <Box
          sx={{
            textAlign: 'center',
            letterSpacing: '0.5rem',
            lineHeight: '2.5rem',
            userSelect: 'none',
            fontSize: '1.3rem'
          }}
        >
          <Box sx={{ fontSize: '2.5rem', fontWeight: 800 }}>Welcome</Box>
          <Box sx={{ mt: '1rem' }}>Portfolio | Janis Dregeris</Box>
          <Divider />
          <Box>
            <img src={rotateImage} alt="" />
          </Box>
        </Box>
        <Box className="button-container" onClick={hideInitialPopup}>
          <div id="left-border"></div>
          <div id="top-border"></div>
          <Box className="button">Explore</Box>
          <div id="bottom-border"></div>
          <div id="right-border"></div>
        </Box>
      </Box>
    </Box>
  )
}

export default InitialPopUp
