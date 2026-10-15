import { Box, Divider, Grid, Link, Stack, Typography } from '@mui/material'
import { contactDetails, contactLinks } from 'data/profile-data'
import SectionShell from './section-shell'

interface IContactSection {
  isDarkMode: boolean
}

function ContactSection({ isDarkMode }: IContactSection) {
  return (
    <SectionShell eyebrow="Reach Out" title="Contact & Presence">
      <Stack spacing={2.5}>
        {contactDetails.map((detail) => (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            key={detail.title}
            spacing={1}
            sx={{ justifyContent: 'space-between' }}
          >
            <Typography sx={{ color: 'text.secondary' }}>
              {detail.title}
            </Typography>
            <Typography>{detail.data}</Typography>
          </Stack>
        ))}
        <Divider
          sx={{
            borderColor: isDarkMode
              ? 'rgba(220, 229, 236, 0.1)'
              : 'rgba(20, 32, 44, 0.1)'
          }}
        />
        <Grid container spacing={2}>
          {contactLinks.map((contact) => {
            const href = contact.email
              ? `mailto:${contact.email}`
              : (contact.url ?? '#')

            return (
              <Grid item key={contact.title} xs={12} sm={6}>
                <Link
                  href={href}
                  rel="noreferrer"
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: '20px',
                    alignItems: 'center',
                    backgroundColor: isDarkMode
                      ? 'rgba(220, 229, 236, 0.06)'
                      : 'rgba(20, 32, 44, 0.05)',
                    transition:
                      'transform 180ms ease, background-color 180ms ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      backgroundColor: isDarkMode
                        ? 'rgba(220, 229, 236, 0.12)'
                        : 'rgba(20, 32, 44, 0.1)'
                    }
                  }}
                  target={contact.email ? undefined : '_blank'}
                  underline="none"
                >
                  <Box
                    alt={contact.title}
                    component="img"
                    src={contact.icon}
                    sx={{ width: 42, height: 42, objectFit: 'contain' }}
                  />
                  <Typography>{contact.title}</Typography>
                </Link>
              </Grid>
            )
          })}
        </Grid>
      </Stack>
    </SectionShell>
  )
}

export default ContactSection
