import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Link,
  Stack,
  Typography
} from '@mui/material'
import photo from 'assets/images/photo.png'
import cvDocument from 'assets/Janis_Dregeris_CV.pdf'
import { aboutParagraphs, contactDetails } from 'data/profile-data'

const heroLabels = [
  'Clean code and architecture',
  'Spec Driven development',
  'Work with designers and product teams',
  'Team spirit and collaboration',
  'Mentorship and knowledge sharing',
  'Continuous learning and growth'
]

interface IPointerRatio {
  x: number
  y: number
}

interface IHeroSection {
  isDarkMode: boolean
  isReducedMotion: boolean
  pointerRatio: IPointerRatio
}

function HeroSection({
  isDarkMode,
  isReducedMotion,
  pointerRatio
}: IHeroSection) {
  const email =
    contactDetails.find(({ title }) => title === 'Email:')?.data ??
    'juandre@inbox.lv'
  const website =
    contactDetails.find(({ title }) => title === 'Website:')?.data ??
    'https://ee-ze.com/'

  return (
    <Grid
      container
      spacing={4}
      sx={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        py: { xs: 10, md: 14 },
        alignItems: 'center'
      }}
    >
      <Grid size={{ xs: 12, md: 7 }}>
        <Stack spacing={3}>
          <Typography sx={{ color: 'secondary.main', letterSpacing: '0.14em' }}>
            INTERACTIVE WEB
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', md: '5.8rem' },
              lineHeight: 0.94,
              maxWidth: '10ch'
            }}
          >
            Crafted depth for product, code, and business.
          </Typography>
          <Typography
            sx={{
              maxWidth: '56ch',
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.8
            }}
          >
            A portfolio experience that consolidates the full CV, contact
            information and art direction.
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            {heroLabels.map((label) => (
              <Chip
                key={label}
                label={label}
                sx={{
                  borderRadius: '999px',
                  color: 'text.primary',
                  backgroundColor: isDarkMode
                    ? 'rgba(220, 229, 236, 0.1)'
                    : 'rgba(20, 32, 44, 0.08)'
                }}
              />
            ))}
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component="a"
              href={cvDocument}
              rel="noreferrer"
              target="_blank"
              variant="contained"
            >
              Download CV
            </Button>
            <Button
              color="secondary"
              component="a"
              href="#contact-presence"
              variant="text"
            >
              Contact
            </Button>
          </Stack>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Box
          sx={{
            borderRadius: '36px',
            border: isDarkMode
              ? '1px solid rgba(220, 229, 236, 0.14)'
              : '1px solid rgba(20, 32, 44, 0.12)',
            backgroundColor: isDarkMode
              ? 'rgba(12, 17, 23, 0.68)'
              : 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(18px)',
            p: { xs: 3, md: 4 },
            transform: isReducedMotion
              ? 'none'
              : `translate3d(${pointerRatio.x * 18}px, ${pointerRatio.y * 18}px, 0)`,
            transition: isReducedMotion ? 'none' : 'transform 180ms ease-out'
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Avatar
                alt="Janis Dregeris"
                src={photo}
                sx={{ width: 88, height: 88 }}
              />
              <Box>
                <Typography variant="h2" sx={{ fontSize: '1.8rem' }}>
                  Janis Dregeris
                </Typography>
                <Typography sx={{ color: 'secondary.main' }}>
                  Full Stack Engineer
                </Typography>
              </Box>
            </Stack>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              {aboutParagraphs[0].replace(/\s+/g, ' ').trim()}
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              {aboutParagraphs[1].replace(/\s+/g, ' ').trim()}
            </Typography>
            <Stack spacing={1.5}>
              <Link
                href={website}
                rel="noreferrer"
                target="_blank"
                underline="hover"
              >
                {website}
              </Link>
              <Link href={`mailto:${email}`} underline="hover">
                {email}
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  )
}

export default HeroSection
