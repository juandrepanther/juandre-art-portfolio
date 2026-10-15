import { Box, Grid, Link, Stack, Typography } from '@mui/material'
import { certificatesData, sectionTitles } from 'data/profile-data'
import SectionShell from './section-shell'

interface ICertificatesSection {
  isDarkMode: boolean
}

function CertificatesSection({ isDarkMode }: ICertificatesSection) {
  return (
    <SectionShell eyebrow="Proof" title={sectionTitles[4]}>
      <Grid container spacing={2.5}>
        {certificatesData.map((certificate) => (
          <Grid item key={certificate.title} xs={12} sm={6} md={3}>
            <Link
              href={certificate.url}
              rel="noreferrer"
              sx={{
                display: 'block',
                height: '100%',
                borderRadius: '28px',
                border: isDarkMode
                  ? '1px solid rgba(220, 229, 236, 0.1)'
                  : '1px solid rgba(20, 32, 44, 0.1)',
                backgroundColor: isDarkMode
                  ? 'rgba(220, 229, 236, 0.04)'
                  : 'rgba(20, 32, 44, 0.04)',
                p: 2.5
              }}
              target="_blank"
              underline="none"
            >
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Box
                  alt={certificate.title}
                  component="img"
                  src={certificate.logo}
                  sx={{ width: 64, height: 64, objectFit: 'contain' }}
                />
                <Typography sx={{ fontWeight: 700 }}>
                  {certificate.title}
                </Typography>
                {certificate.id ? (
                  <Typography sx={{ color: 'text.secondary', mt: 'auto' }}>
                    Validation ID: {certificate.id}
                  </Typography>
                ) : null}
              </Stack>
            </Link>
          </Grid>
        ))}
      </Grid>
    </SectionShell>
  )
}

export default CertificatesSection
