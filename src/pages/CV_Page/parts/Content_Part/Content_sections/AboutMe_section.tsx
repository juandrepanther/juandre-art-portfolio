import { Box } from '@mui/material'
import React from 'react'
import { paragraph1, paragraph2, section_titles } from '../../Content_Data'

function AboutMe_section() {
  return (
    <>
      <h4 style={{ fontSize: '2rem' }}>{section_titles[0]}</h4>
      <Box sx={{ width: { xs: '100%', md: '70%' } }}>
        <p style={{ marginTop: '2rem' }}>{paragraph1}</p>
        <p style={{ marginTop: '2rem' }}>{paragraph2}</p>
      </Box>
    </>
  )
}

export default AboutMe_section
