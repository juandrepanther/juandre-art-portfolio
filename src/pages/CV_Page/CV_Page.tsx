import React, { useEffect, useState, useRef } from 'react'
import Content_part from './parts/Content_Part/Content_part'
import Header_part from './parts/Header_part'
import background from '../../assets/images/CV_bgd.png'
import face from '../../assets/images/photo.png'
import CV from '../../assets/Janis_Dregeris_CV.pdf'
import { Box, Paper } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectDarkMode } from '../../redux/selectors/useSelectors'
import { DarkModeClassType } from '../../hooks/useDarkMode'

function CV_Page() {
  const certificateTemplateRef = useRef<any>(null)
  const isDarkMode_store = useSelector(selectDarkMode)
  const [darkModeClass, setDarkModeClass] =
    useState<DarkModeClassType>('on-page-load')

  useEffect(() => {
    if (isDarkMode_store) {
      setDarkModeClass('dark-mode')
    } else if (darkModeClass !== 'on-page-load') {
      setDarkModeClass('light-mode')
    }
  }, [isDarkMode_store])

  const openCV = () => window.open(CV, '_blank')

  return (
    <Box
      sx={{
        height: '45%',
        background: `url(${background}) center center`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Box
        ref={certificateTemplateRef}
        sx={{
          pt: '10rem',
          pb: '2rem',
          position: 'relative'
        }}
      >
        <Box
          className="content-container"
          sx={{
            position: 'relative',
            backgroundColor: 'white',
            width: '95%',
            mx: 'auto',
            borderRadius: '2rem'
          }}
        >
          <div className={`overlay ${darkModeClass}`}></div>
          <Box
            className="photo-wrapper-box"
            sx={{
              position: 'absolute',
              width: '100%',
              top: '-6rem',
              mx: 'auto',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 1
            }}
          >
            <img width="200px" src={face} alt="" />
          </Box>
          <Paper
            elevation={5}
            className="text-wrapper"
            sx={{
              pt: '6.7rem',
              fontFamily: 'Montserrat',
              px: '2rem',
              borderRadius: '1rem'
            }}
          >
            <Header_part />
            <Content_part />
          </Paper>
        </Box>
      </Box>
      <button className="download-button" onClick={openCV}>
        Download
      </button>
    </Box>
  )
}

export default CV_Page
