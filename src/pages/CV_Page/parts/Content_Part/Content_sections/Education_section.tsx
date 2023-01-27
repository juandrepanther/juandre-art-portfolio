import { Box } from '@mui/material'
import React from 'react'
import { educationAndCourses, section_titles } from '../../Content_Data'

function Education_section() {
  return (
    <Box>
      <h4 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        {section_titles[3]}
      </h4>
      {educationAndCourses.map((item) => {
        return (
          <Box
            sx={{
              pb: '2rem',
              borderLeft: '.3rem solid #e0e0e0 ',
              pl: '1rem',
              position: 'relative'
            }}
          >
            <h6 style={{ fontSize: '1.5rem' }}>{item.title}</h6>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <p>{item.place}</p>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
              <p>{item.year}</p>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                zIndex: 2,
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                backgroundColor: 'black',
                top: '0.35rem',
                left: '-.57rem'
              }}
            ></Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default Education_section
