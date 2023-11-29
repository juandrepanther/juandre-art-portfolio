import { Box } from '@mui/material'
import React from 'react'
import { generalSKills, mySkills, section_titles } from '../../Content_Data'

function MySkills_section() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h4 style={{ fontSize: '2rem' }}>{section_titles[2]}</h4>
      {mySkills.map((skill, index) => {
        return (
          <Box
            key={index}
            sx={{
              mt: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              height: '1rem'
            }}
          >
            <p>{skill.tech}</p>
          </Box>
        )
      })}
      <p style={{ marginTop: '2rem' }}>{generalSKills}</p>
    </div>
  )
}

export default MySkills_section
