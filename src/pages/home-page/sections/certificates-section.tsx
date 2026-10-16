import { Box, Link, Stack, Typography } from '@mui/material'
import { certificatesData, sectionTitles } from 'data/profile-data'
import { createInteractiveSurfaceSx } from 'utils/interactive-surface'
import SectionShell from './section-shell'

interface ICertificatesSection {
  isDarkMode: boolean
}

function CertificatesSection({ isDarkMode }: ICertificatesSection) {
  return (
    <SectionShell eyebrow="Proof" title={sectionTitles[4]}>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))'
          }
        }}
      >
        {certificatesData.map((certificate) => (
          <Box
            key={certificate.title}
            sx={{
              display: 'flex',
              minWidth: 0
            }}
          >
            <Link
              href={certificate.url}
              rel="noreferrer"
              sx={[
                createInteractiveSurfaceSx({
                  backgroundOpacity: 0.04,
                  hoverBackgroundOpacity: 0.08,
                  borderOpacity: 0.1,
                  hoverBorderOpacity: 0.2,
                  lift: 3,
                  shadowOpacity: 0.06,
                  hoverShadowOpacity: 0.16,
                  enableFocusVisible: true
                }),
                {
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  minHeight: { xs: 220, md: 240 },
                  border: '1px solid transparent',
                  borderRadius: '28px',
                  p: 2.5
                }
              ]}
              target="_blank"
              underline="none"
            >
              <Stack
                spacing={2.5}
                sx={{
                  height: '100%',
                  width: '100%'
                }}
              >
                <Box
                  alt={certificate.title}
                  component="img"
                  src={certificate.logo}
                  sx={{
                    width: 64,
                    height: 64,
                    objectFit: 'contain',
                    filter:
                      isDarkMode && certificate.title === 'UNREAL ENGINE 5'
                        ? 'brightness(0) invert(1)'
                        : 'none'
                  }}
                />
                <Typography sx={{ fontWeight: 700, minHeight: 56 }}>
                  {certificate.title}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    minHeight: 48,
                    visibility: certificate.id ? 'visible' : 'hidden'
                  }}
                >
                  Validation ID: {certificate.id ?? 'Not available'}
                </Typography>
              </Stack>
            </Link>
          </Box>
        ))}
      </Box>
    </SectionShell>
  )
}

export default CertificatesSection
