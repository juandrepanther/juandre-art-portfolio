import { Box, Container, Link, Stack } from '@mui/material'
import { Suspense, lazy, useState } from 'react'
import type { MouseEvent } from 'react'
import useReducedMotion from 'hooks/use-reduced-motion'
import { useThemeStore } from 'lib/zustand/theme-store'
import CertificatesSection from './sections/certificates-section'
import ContactSection from './sections/contact-section'
import EducationSection from './sections/education-section'
import ExperienceSection from './sections/experience-section'
const GlassBackground = lazy(() => import('./glass-background'))
import HeroSection from './sections/hero-section'
import HomePageHeader from './sections/home-page-header'
import SkillsSection from './sections/skills-section'

interface IPointerRatio {
  x: number
  y: number
}

function HomePage() {
  const { isDarkMode, toggleDarkMode } = useThemeStore()
  const isReducedMotion = useReducedMotion()
  const [pointerRatio, setPointerRatio] = useState<IPointerRatio>({
    x: 0,
    y: 0
  })
  const sectionGap = { xs: 3, md: 4 }

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

  const pageGutter = { xs: 2, sm: 3, lg: 4 }

  return (
    <Box sx={{ backgroundColor: 'background.default', color: 'text.primary' }}>
      <Link
        href="#main-content"
        sx={{
          position: 'absolute',
          left: 16,
          top: -48,
          zIndex: 20,
          px: 2,
          py: 1,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          textDecoration: 'none',
          '&:focus-visible': {
            top: 16
          }
        }}
      >
        Skip to main content
      </Link>
      <HomePageHeader
        actionHref="/game"
        actionLabel="Play Varang Kill (Alpha)"
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

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
          <GlassBackground />
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
        <Container
          disableGutters
          maxWidth="lg"
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Box sx={{ px: pageGutter }}>
            <Stack spacing={sectionGap} sx={{ pb: { xs: 5, md: 7 } }}>
              <HeroSection
                isDarkMode={isDarkMode}
                isReducedMotion={isReducedMotion}
                pointerRatio={pointerRatio}
              />

              <Box
                sx={{
                  display: 'grid',
                  gap: sectionGap,
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    md: 'minmax(0, 1.2fr) minmax(0, 0.8fr)'
                  }
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <ExperienceSection isDarkMode={isDarkMode} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <SkillsSection isDarkMode={isDarkMode} />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gap: sectionGap,
                  gridTemplateColumns: {
                    xs: 'minmax(0, 1fr)',
                    md: 'repeat(2, minmax(0, 1fr))'
                  }
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <EducationSection />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <ContactSection isDarkMode={isDarkMode} />
                </Box>
              </Box>

              <CertificatesSection isDarkMode={isDarkMode} />
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
