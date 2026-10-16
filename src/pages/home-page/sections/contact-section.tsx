import { Box, Divider, Link, Stack, Typography } from '@mui/material'
import { contactDetails, contactLinks } from 'data/profile-data'
import { createInteractiveSurfaceSx } from 'utils/interactive-surface'
import SectionShell from './section-shell'

interface IContactSection {
  isDarkMode: boolean
}

function ContactSection({ isDarkMode }: IContactSection) {
  return (
    <SectionShell eyebrow="Reach Out" title="Contact & Presence">
      <Stack spacing={3}>
        {contactDetails.map((detail) => (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            key={detail.title}
            spacing={1.5}
            sx={{ justifyContent: 'space-between' }}
          >
            <Typography sx={{ color: 'text.secondary' }}>
              {detail.title}
            </Typography>
            <Typography sx={{ overflowWrap: 'anywhere' }}>
              {detail.data}
            </Typography>
          </Stack>
        ))}
        <Divider
          sx={{
            borderColor: isDarkMode
              ? 'rgba(220, 229, 236, 0.1)'
              : 'rgba(20, 32, 44, 0.1)'
          }}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2
          }}
        >
          {contactLinks.map((contact) => {
            const href = contact.email
              ? `mailto:${contact.email}`
              : (contact.url ?? '#')

            return (
              <Box
                key={contact.title}
                sx={{ borderRadius: '1rem', overflow: 'hidden' }}
              >
                <Link
                  href={href}
                  rel="noreferrer"
                  sx={[
                    createInteractiveSurfaceSx({
                      backgroundOpacity: 0.06,
                      hoverBackgroundOpacity: 0.12,
                      borderOpacity: 0,
                      hoverBorderOpacity: 0.16,
                      lift: 2,
                      shadowOpacity: 0.04,
                      hoverShadowOpacity: 0.14,
                      enableFocusVisible: true
                    }),
                    {
                      display: 'flex',
                      p: 1,
                      gap: 1.5,
                      border: '1px solid transparent',
                      alignItems: 'center',
                      minHeight: 77
                    }
                  ]}
                  target={contact.email ? undefined : '_blank'}
                  underline="none"
                >
                  <Box
                    sx={{
                      width: 48,
                      minWidth: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Box
                      alt={contact.title}
                      component="img"
                      src={contact.icon}
                      sx={{
                        width: 42,
                        height: 42,
                        objectFit: 'contain',
                        filter: isDarkMode ? 'brightness(0) invert(1)' : 'none'
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '.9rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {contact.title}
                  </Typography>
                </Link>
              </Box>
            )
          })}
        </Box>
      </Stack>
    </SectionShell>
  )
}

export default ContactSection
