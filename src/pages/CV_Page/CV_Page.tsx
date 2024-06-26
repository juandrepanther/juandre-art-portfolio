import { Box, Paper } from '@mui/material'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import background from '../../assets/images/CV_bgd.png'
import face from '../../assets/images/photo.png'
import { DarkModeClassType, SetIconColorType } from '../../hooks/useDarkMode'
import { selectDarkMode } from '../../redux/selectors/useSelectors'
import Content_part from './parts/Content_Part/Content_part'
import Header_part from './parts/Header_part'
// import jsPDF from 'jspdf'

function CV_Page() {
  const certificateTemplateRef = useRef<any>(null)
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

  // const handleGeneratePdf = () => {
  //   const doc = new jsPDF({
  //     orientation: 'p',
  //     format: 'a2',
  //     unit: 'pt',
  //     compress: true,
  //     precision: 10
  //   })

  //   // Adding the fonts
  //   doc.setFont('Helvetica', 'Arial', 500)

  //   doc.html(certificateTemplateRef.current, {
  //     margin: [20, 20, 20, 20],
  //     async callback(document) {
  //       // save the document as a PDF with name of Memes
  //       document.save('CV_Janis_Dregeris')
  //     }
  //   })
  // }

  const download = () => {
    const fileUrl = '/CV.pdf'
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = 'CV_Janis_Dregeris.pdf'
    link.click()
  }

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
      <button
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          margin: '50px',
          padding: '10px',
          backgroundColor: 'white',
          color: 'black',
          fontSize: '1.2rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          width: '200px',
          zIndex: 1,
          borderRadius: '2rem'
        }}
        onClick={download}
      >
        Download
      </button>
    </Box>
  )
}

export default CV_Page
