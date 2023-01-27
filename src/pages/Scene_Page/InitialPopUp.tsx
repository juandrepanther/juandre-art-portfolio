import React from 'react'

//@REDUX IMPORTS
import { useDispatch } from 'react-redux'
import { changeInitialPopupVisibility } from '../../redux/reducers/initialPopupReducer'
import { changeIsPlayingBackgroundMusic } from '../../redux/reducers/backgroundMusicReducer'
import { setSideBar_status } from '../../redux/reducers/sideBarReducer'

import rotateImage from '../../assets/images/rotateImg.png'

//@MATERIAL UI IMPORTS
import { Box, Divider } from '@mui/material'

//@COMPONENTS IMPORTS

function InitialPopUp() {
  const dispatch = useDispatch()

  //AUDIO RUN ON CLICK and SHOW Audio Player

  const hideInitialPopup = () => {
    dispatch(changeInitialPopupVisibility(false))
    dispatch(changeIsPlayingBackgroundMusic(true))
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
