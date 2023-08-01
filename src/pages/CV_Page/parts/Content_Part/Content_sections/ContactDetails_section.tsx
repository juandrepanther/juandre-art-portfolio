import { Box } from '@mui/material'
import React from 'react'
import { contact_details } from '../../Content_Data'

function ContactDetails_section() {
  return (
    <>
      {contact_details.map((detailsItem, i) => {
        return (
          <Box key={i} sx={{ mt: '2rem' }}>
            <h6 style={{ fontSize: '1.5rem' }}>{detailsItem.title}</h6>
            <p style={{ fontSize: '1.5rem' }}>{detailsItem.data}</p>
          </Box>
        )
      })}
    </>
  )
}

export default ContactDetails_section
