import { Box } from '@mui/material'
import React from 'react'
import { generalSKills, mySkills, section_titles } from '../../Content_Data'

function MySkills_section() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h4 style={{ fontSize: '2rem' }}>{section_titles[2]}</h4>
      {mySkills.map((skill) => {
        return (
          <Box
            sx={{
              mt: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              height: '1.8rem'
            }}
          >
            <p>{skill.tech}</p>
            <Box
              className="progress-container"
              sx={{
                width: '50%',
                height: '70%',
                border: '.2rem solid black',
                borderRadius: '5px'
              }}
            >
              <Box
                className="progress-level"
                sx={{
                  width: `${skill.level}%`,
                  backgroundColor: 'black',
                  height: '100%',
                  color: 'white'
                }}
              >
                <p
                  style={{ marginLeft: '.4rem', fontSize: '.7rem' }}
                >{`~ ${skill.level}%`}</p>
              </Box>
            </Box>
          </Box>
        )
      })}
      <p style={{ marginTop: '2rem' }}>{generalSKills}</p>
    </div>
  )
}

export default MySkills_section
