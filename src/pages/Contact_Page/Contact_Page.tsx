import { Box } from '@mui/material'
import React from 'react'
import backgroundImg from '../../assets/images/contactsBgd.jpg'
import { ContactsData } from './ContactData'

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
          p: '3rem',
          pt: '3.5rem',
          height: '60%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <h4 style={{ fontSize: '3rem' }}>Contact Me</h4>
        <p
          style={{
            textAlign: 'center',
            color: 'grey',
            marginTop: '1.3rem',
            width: '60%'
          }}
        >
          I am pretty happy that you have been here. In case of the interesting
          deals please reach me out using the contacts below.
        </p>
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
                    <a style={{ textDecoration: 'none', color: 'black' }}>
                      {contact.title}
                    </a>
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
