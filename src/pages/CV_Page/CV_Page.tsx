import { Box, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import background from '../../assets/images/CV_bgd.png'
import face from '../../assets/images/photo.png'
import useDarkMode, {
  DarkModeClassType,
  SetIconColorType
} from '../../hooks/useDarkMode'
import { selectDarkMode } from '../../redux/selectors/useSelectors'
import Content_part from './parts/Content_Part/Content_part'
import Header_part from './parts/Header_part'

function CV_Page() {
  const isDarkMode_store = useSelector(selectDarkMode)
  const [darkModeClass, setDarkModeClass] =
    useState<DarkModeClassType>('on-page-load')
  const [iconColor, setIconColor] = useState<SetIconColorType>('black')

  useEffect(() => {
    if (isDarkMode_store) {
      setDarkModeClass('dark-mode')
      setIconColor('white')
    } else if (darkModeClass !== 'on-page-load') {
      setDarkModeClass('light-mode')
      setIconColor('black')
    }
  }, [isDarkMode_store])

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
            mx: 'auto'
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
              px: '2rem'
            }}
          >
            <Header_part />
            <Content_part />
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default CV_Page
