import { Box, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SetIconColorType } from '../../../../hooks/useDarkMode'
import { selectDarkMode } from '../../../../redux/selectors/useSelectors'
import AboutMe_section from './Content_sections/AboutMe_section'
import Certificates_section from './Content_sections/Certificates_section'
import ContactDetails_section from './Content_sections/ContactDetails_section'
import Education_section from './Content_sections/Education_section'
import Experience_section from './Content_sections/Experience_section'
import MySkills_section from './Content_sections/MySkills_section'

function Content_part() {
  const isDarkMode_store = useSelector(selectDarkMode)
  const [iconColor, setIconColor] = useState<SetIconColorType>('black')

  useEffect(() => {
    if (isDarkMode_store) {
      setIconColor('white')
    } else {
      setIconColor('black')
    }
  }, [isDarkMode_store])

  return (
    <Grid container spacing={7} sx={{ mt: '2rem' }}>
      <Grid
        item
        xs={12}
        lg={6}
        sm={12}
        md={6}
        xl={6}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        <AboutMe_section />
        <MySkills_section />
      </Grid>
      <Grid
        item
        xs={12}
        lg={6}
        sm={12}
        md={6}
        xl={6}
        sx={{ position: 'relative', color: iconColor }}
      >
        <Experience_section />
        <Box
          className="line-hider-trick"
          sx={{
            zIndex: 1,
            position: 'absolute',
            backgroundColor: iconColor === 'white' ? 'black' : 'white',
            width: '1rem',
            height: '1rem',
            top: '7.75rem',
            left: '3.2rem'
          }}
        ></Box>
      </Grid>
      <Grid item xs={12} lg={6} sm={12} md={6} xl={6}>
        <ContactDetails_section />
      </Grid>
      <Grid
        sx={{ color: iconColor, position: 'relative' }}
        item
        xs={12}
        lg={6}
        sm={12}
        md={6}
        xl={6}
      >
        <Education_section />
        <Box
          className="line-hider-trick"
          sx={{
            zIndex: 1,
            position: 'absolute',
            backgroundColor: iconColor === 'white' ? 'black' : 'white',
            width: '1rem',
            height: '1rem',
            top: '7.75rem',
            left: '3.2rem'
          }}
        ></Box>
      </Grid>
      <Grid item xs={12} lg={12} sm={12} md={12} xl={12}>
        <Certificates_section />
      </Grid>
    </Grid>
  )
}

export default Content_part
