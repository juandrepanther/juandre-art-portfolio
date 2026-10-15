import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Link,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material'
import { Suspense, lazy, useState } from 'react'
import type { MouseEvent } from 'react'
import photo from '../../assets/images/photo.png'
import cvDocument from '../../assets/Janis_Dregeris_CV.pdf'
import {
  aboutParagraphs,
  certificatesData,
  contactDetails,
  contactLinks,
  educationAndCourses,
  experienceSteps,
  generalSkills,
  mySkills,
  sectionTitles
} from '../../data/profile-data'
import useReducedMotion from '../../hooks/use-reduced-motion'
import { useThemeStore } from '../../lib/zustand/theme-store'
const GlassBackground = lazy(() => import('./glass-background'))
import SectionShell from './section-shell'

const heroLabels = [
  'Immersive Home route',
  'Shader-driven glass layers',
  'Full CV on one page',
  'Contact details included'
]

function HomePage() {
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const isReducedMotion = useReducedMotion()
  const [pointerRatio, setPointerRatio] = useState({ x: 0, y: 0 })

  const email =
    contactDetails.find(({ title }) => title === 'Email:')?.data ??
    'juandre@inbox.lv'
  const website =
    contactDetails.find(({ title }) => title === 'Website:')?.data ??
    'https://ee-ze.com/'

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) {
      return
    }

    const { currentTarget, clientX, clientY } = event
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    const x = (clientX - left) / width - 0.5
    const y = (clientY - top) / height - 0.5

    setPointerRatio({ x, y })
  }

  const handlePointerLeave = () => {
    setPointerRatio({ x: 0, y: 0 })
  }

  return (
    <Box sx={{ backgroundColor: 'background.default', color: 'text.primary' }}>
      <Box className="skip-link" component="a" href="#main-content">
        Skip to main content
      </Box>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(18px)',
          backgroundColor: isDarkMode
            ? 'rgba(12, 17, 23, 0.4)'
            : 'rgba(243, 245, 248, 0.82)',
          borderBottom: isDarkMode
            ? '1px solid rgba(220, 229, 236, 0.08)'
            : '1px solid rgba(20, 32, 44, 0.12)'
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: 'min(1200px, calc(100% - 32px))',
            mx: 'auto',
            py: 2,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: 'secondary.main' }}>
              JANIS DREGERIS
            </Typography>
            <Typography variant="h1" sx={{ fontSize: '1rem' }}>
              FULL STACK ENGINEER
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <IconButton
              aria-label="toggle dark mode"
              color="secondary"
              onClick={toggleDarkMode}
            ></IconButton>
          </Stack>
        </Stack>
      </Box>

      <Box
        component="main"
        id="main-content"
        onMouseLeave={handlePointerLeave}
        onMouseMove={handlePointerMove}
        sx={{
          position: 'relative',
          minHeight: '100vh',
          overflow: 'clip'
        }}
      >
        <Suspense fallback={null}>
          <GlassBackground isReducedMotion={isReducedMotion} />
        </Suspense>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isDarkMode
              ? 'linear-gradient(180deg, rgba(12, 17, 23, 0.15) 0%, rgba(12, 17, 23, 0.82) 72%, rgba(12, 17, 23, 1) 100%)'
              : 'linear-gradient(180deg, rgba(243, 245, 248, 0.08) 0%, rgba(243, 245, 248, 0.7) 72%, rgba(243, 245, 248, 0.96) 100%)'
          }}
        />
        <Grid
          container
          spacing={4}
          sx={{
            position: 'relative',
            zIndex: 1,
            width: 'min(1200px, calc(100% - 32px))',
            mx: 'auto',
            minHeight: '100vh',
            py: { xs: 10, md: 14 },
            alignItems: 'center'
          }}
        >
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Typography
                sx={{ color: 'secondary.main', letterSpacing: '0.14em' }}
              >
                INTERACTIVE CV APPLICATION
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '5.8rem' },
                  lineHeight: 0.94,
                  maxWidth: '10ch'
                }}
              >
                Crafted depth for product, code, and play.
              </Typography>
              <Typography
                sx={{
                  maxWidth: '56ch',
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  lineHeight: 1.8
                }}
              >
                A rebuilt portfolio experience that consolidates the full CV,
                contact information, and art direction into one immersive Home
                route.
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
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
          <Grid item xs={12} md={5}>
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
                  : `translate3d(${pointerRatio.x * 18}px, ${
                      pointerRatio.y * 18
                    }px, 0)`,
                transition: isReducedMotion
                  ? 'none'
                  : 'transform 180ms ease-out'
              }}
            >
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
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
      </Box>

      <Stack
        spacing={3}
        sx={{ width: 'min(1200px, calc(100% - 32px))', mx: 'auto', py: 6 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <SectionShell eyebrow="Profile" title={sectionTitles[1]}>
              <Stack spacing={3}>
                {experienceSteps.map((experienceStep) => (
                  <Box key={`${experienceStep.title}-${experienceStep.year}`}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1}
                      sx={{ justifyContent: 'space-between', mb: 1 }}
                    >
                      <Box>
                        <Typography
                          sx={{ fontSize: '1.2rem', fontWeight: 700 }}
                        >
                          {experienceStep.title}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          {experienceStep.place}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: 'secondary.main' }}>
                        {experienceStep.year}
                      </Typography>
                    </Stack>
                    <Stack
                      component="ul"
                      spacing={1}
                      sx={{ color: 'text.secondary' }}
                    >
                      {experienceStep.responsibilities.map((responsibility) => (
                        <Box component="li" key={responsibility}>
                          {responsibility.replace(/\s+/g, ' ').trim()}
                        </Box>
                      ))}
                    </Stack>
                    <Divider
                      sx={{
                        mt: 3,
                        borderColor: isDarkMode
                          ? 'rgba(220, 229, 236, 0.1)'
                          : 'rgba(20, 32, 44, 0.1)'
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </SectionShell>
          </Grid>
          <Grid item xs={12} md={5}>
            <SectionShell eyebrow="Capabilities" title={sectionTitles[2]}>
              <Stack spacing={2.5}>
                {mySkills.map((skill) => (
                  <Box key={skill.tech}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', mb: 1 }}
                    >
                      <Typography>{skill.tech}</Typography>
                      <Typography sx={{ color: 'secondary.main' }}>
                        {skill.level}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      sx={{
                        height: 10,
                        borderRadius: '999px',
                        backgroundColor: isDarkMode
                          ? 'rgba(220, 229, 236, 0.08)'
                          : 'rgba(20, 32, 44, 0.08)'
                      }}
                      value={skill.level}
                      variant="determinate"
                    />
                  </Box>
                ))}
                <Divider
                  sx={{
                    borderColor: isDarkMode
                      ? 'rgba(220, 229, 236, 0.1)'
                      : 'rgba(20, 32, 44, 0.1)'
                  }}
                />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {generalSkills.split('|').map((skill) => (
                    <Chip
                      key={skill}
                      label={skill.trim()}
                      sx={{
                        backgroundColor: isDarkMode
                          ? 'rgba(220, 229, 236, 0.08)'
                          : 'rgba(20, 32, 44, 0.08)'
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </SectionShell>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SectionShell eyebrow="Credentials" title={sectionTitles[3]}>
              <Stack spacing={2}>
                {educationAndCourses.map((educationItem) => (
                  <Stack
                    direction="row"
                    key={`${educationItem.title}-${educationItem.year}`}
                    spacing={2}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>
                        {educationItem.title}
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>
                        {educationItem.place}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ color: 'secondary.main', whiteSpace: 'nowrap' }}
                    >
                      {educationItem.year}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </SectionShell>
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
        </Grid>

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
      </Stack>
    </Box>
  )
}

export default HomePage
