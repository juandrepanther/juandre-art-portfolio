import React from 'react'
import { Box, Typography } from '@mui/material'
import { ContactsData } from './ContactData'
import backgroundImg from '../../assets/images/contactsBgd.jpg'

function Contact_Page() {
  const openSiteHandler = (url: string) =>
    url && window.open(url, '_blank', 'noreferrer')

  return (
    <Box
      sx={{
        fontFamily: 'monospace',
        height: '100%',
        background: `url(${backgroundImg}) center center`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Box
        sx={{
          p: { xs: '1rem', md: '3rem' },
          pt: '3.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography sx={{ fontSize: '3rem', fontFamily: 'monospace' }}>
          Contact Me
        </Typography>
        <Typography
          sx={{
            fontFamily: 'monospace',
            textAlign: 'center',
            color: 'grey',
            marginTop: '1.3rem',
            width: { xs: '100%', md: '60%' }
          }}
        >
          I appreciate your visit. For any inquiries or potential
          collaborations, please feel free to contact me using the options
          provided below.
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%'
          }}
        >
          {ContactsData.map((contact, i) => {
            return (
              <Box
                onClick={() => openSiteHandler(contact.url)}
                key={i}
                sx={{
                  mt: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: '.2s',
                  '&:hover': {
                    transform: 'scale(1.2)'
                  }
                }}
              >
                {contact.title !== 'EMAIL' ? (
                  <>
                    <img
                      width="60rem"
                      src={contact.icon}
                      alt=""
                      style={{ marginBottom: '1rem' }}
                    />
                    <p>{contact.title}</p>
                  </>
                ) : (
                  <a
                    href={`mailto:${contact.email}`}
                    style={{
                      textDecoration: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}
                  >
                    <img
                      width="60rem"
                      src={contact.icon}
                      alt=""
                      style={{ marginBottom: '1rem' }}
                    />
                    <span style={{ textDecoration: 'none', color: 'black' }}>
                      {contact.title}
                    </span>
                  </a>
                )}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

export default Contact_Page
