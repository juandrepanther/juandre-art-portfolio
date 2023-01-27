import { Box, Tooltip } from '@mui/material'
import React from 'react'
import { displayFlexCenterColumn } from '../../../../../utils/globalStyles'
import { certificates_data, section_titles } from '../../Content_Data'

function Certificates_section() {
  const checkValidityHandler = (url: string) =>
    window.open(url, '_blank', 'noreferrer')

  return (
    <Box sx={{ mb: '2rem' }}>
      <h4 style={{ fontSize: '2rem', textAlign: 'center' }}>
        {section_titles[4]}
      </h4>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {certificates_data.map((certificate) => {
          return (
            <Tooltip title="Click & Check the Validity" placement="top">
              <Box
                sx={{
                  cursor: 'pointer',
                  mt: '1.5rem',
                  width: '17rem',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center'
                }}
              >
                <Box onClick={() => checkValidityHandler(certificate.url)}>
                  <img width="90rem" src={certificate.logo} alt="" />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    onClick={() => checkValidityHandler(certificate.url)}
                    sx={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <p style={{ fontWeight: 600 }}>{certificate.title}</p>
                  </Box>

                  {certificate.id && (
                    <Tooltip
                      placement="bottom"
                      title="Select the Validation Number and Copy it."
                    >
                      <p
                        style={{ fontSize: '0.9rem', cursor: 'text' }}
                      >{`Validation Number: ${certificate.id}`}</p>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            </Tooltip>
          )
        })}
      </Box>
    </Box>
  )
}

export default Certificates_section
