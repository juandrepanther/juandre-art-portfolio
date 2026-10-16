import {
  Avatar,
  Box,
  Button,
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

const heroNavigationLinks = [
  { href: '#contact-presence', label: 'Contact' },
  { href: '#education-courses', label: 'Education' },
  { href: '#certificates', label: 'Certificates' }
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
  const heroColumnGap = { xs: 4, md: 5 }
  const heroContentSpacing = { xs: 3, md: 4 }
  const heroCardPadding = { xs: 3, md: 4 }
  const heroHeadlineColor = isDarkMode ? '#ffffff' : 'text.primary'
  const heroEyebrowColor = isDarkMode ? '#ffffff' : 'secondary.main'
  const heroSupportingTextColor = isDarkMode ? '#ffffff' : 'text.secondary'
  const heroCardTextColor = isDarkMode
    ? 'rgba(20, 32, 44, 0.96)'
    : 'text.primary'
  const heroCardMutedTextColor = isDarkMode
    ? 'rgba(66, 83, 100, 0.96)'
    : 'text.secondary'

  const email =
    contactDetails.find(({ title }) => title === 'Email:')?.data ??
    'juandre@inbox.lv'
  const website =
    contactDetails.find(({ title }) => title === 'Website:')?.data ??
    'https://ee-ze.com/'

  return (
    <Grid
      container
      sx={{
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        alignItems: { xs: 'stretch', md: 'flex-start' },
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        columnGap: { md: heroColumnGap.md },
        rowGap: { xs: heroColumnGap.xs, md: 0 },
        py: { xs: 2, md: 16 }
      }}
    >
      <Grid size={{ xs: 12, md: 7 }} sx={{ minWidth: 0 }}>
        <Stack spacing={heroContentSpacing} sx={{ maxWidth: { md: '40rem' } }}>
          <Typography sx={{ color: heroEyebrowColor, letterSpacing: '0.14em' }}>
            INTERACTIVE WEB
          </Typography>
          <Typography
            variant="h1"
            sx={{
              color: heroHeadlineColor,
              fontSize: {
                xs: 'clamp(2.9rem, 12vw, 4.2rem)',
                md: 'clamp(4.8rem, 8vw, 6.1rem)'
              },
              lineHeight: { xs: 0.98, md: 0.94 },
              maxWidth: { xs: '12ch', md: '10ch' }
            }}
          >
            Crafted depth for product, code, and business.
          </Typography>
          <Typography
            sx={{
              maxWidth: '54ch',
              color: heroSupportingTextColor,
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.8
            }}
          >
            A portfolio experience that consolidates the full CV, contact
            information and art direction.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              maxWidth: { md: '44rem' }
            }}
          >
            {heroLabels.map((label) => (
              <Box
                key={label}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 40,
                  maxWidth: '100%',
                  px: 1.5,
                  py: 1,
                  borderRadius: '999px',
                  backgroundColor: isDarkMode
                    ? 'rgba(220, 229, 236, 0.1)'
                    : 'rgba(20, 32, 44, 0.08)'
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.9rem',
                    lineHeight: 1.35,
                    wordBreak: 'break-word'
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              maxWidth: { xs: '100%', sm: 520 }
            }}
          >
            <Button
              component="a"
              href={cvDocument}
              rel="noreferrer"
              target="_blank"
              variant="contained"
            >
              Download CV
            </Button>
            {heroNavigationLinks.map((navigationLink) => (
              <Button
                color="secondary"
                component="a"
                href={navigationLink.href}
                key={navigationLink.href}
                variant="text"
              >
                {navigationLink.label}
              </Button>
            ))}
          </Box>
        </Stack>
      </Grid>
      <Grid
        size={{ xs: 12, md: 5 }}
        sx={{
          display: 'flex',
          minWidth: 0,
          justifyContent: { md: 'flex-end' }
        }}
      >
        <Box
          sx={{
            mt: { xs: 0, md: 1 },
            mx: { xs: 0, md: 0 },
            maxWidth: { xs: '100%', sm: '40rem', md: '34rem' },
            width: '100%',
            borderRadius: '36px',
            border: isDarkMode
              ? '1px solid rgba(20, 32, 44, 0.08)'
              : '1px solid rgba(20, 32, 44, 0.12)',
            backgroundColor: isDarkMode
              ? '#ffffff'
              : 'rgba(255, 255, 255, 0.78)',
            color: heroCardTextColor,
            backdropFilter: 'blur(18px)',
            p: heroCardPadding,
            transform: isReducedMotion
              ? 'none'
              : `translate3d(${pointerRatio.x * 18}px, ${pointerRatio.y * 18}px, 0)`,
            transition: isReducedMotion ? 'none' : 'transform 180ms ease-out'
          }}
        >
          <Stack spacing={heroContentSpacing}>
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
            <Typography sx={{ color: heroCardMutedTextColor, lineHeight: 1.8 }}>
              {aboutParagraphs[0].replace(/\s+/g, ' ').trim()}
            </Typography>
            <Typography sx={{ color: heroCardMutedTextColor, lineHeight: 1.8 }}>
              {aboutParagraphs[1].replace(/\s+/g, ' ').trim()}
            </Typography>
            <Stack spacing={1.5}>
              <Link
                href={website}
                rel="noreferrer"
                target="_blank"
                sx={{ overflowWrap: 'anywhere' }}
                underline="hover"
              >
                {website}
              </Link>
              <Link
                href={`mailto:${email}`}
                sx={{ overflowWrap: 'anywhere' }}
                underline="hover"
              >
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
