import { Box } from '@mui/material'
import React from 'react'
import { experienceSteps, section_titles } from '../../Content_Data'

function Experience_section() {
  return (
    <Box>
      <h4 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        {section_titles[1]}
      </h4>
      {experienceSteps.map((experienceItem, i) => {
        return (
          <Box
            key={i}
            sx={{
              pb: '2rem',
              borderLeft: '.3rem solid #e0e0e0 ',
              pl: '1rem',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h6 style={{ fontSize: '1.5rem' }}>{experienceItem.title}</h6>
              <p style={{ fontSize: '1rem' }}>{experienceItem.place}</p>
            </Box>
            <h6 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              {experienceItem.year}
            </h6>
            <Box sx={{ mt: '.5rem' }}>
              <ul style={{ paddingLeft: '.5rem' }}>
                {experienceItem.responsibilities.map((responsibility, i) => {
                  return (
                    <li
                      key={i}
                      className="zoom-in effect"
                      style={{ marginTop: '.5rem' }}
                    >
                      {responsibility}
                    </li>
                  )
                })}
              </ul>
            </Box>
            <Box
              sx={{
                zIndex: 2,
                position: 'absolute',
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

export default Experience_section
