import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface ISectionShell {
  title: string
  eyebrow?: string
  children: ReactNode
}

function SectionShell({ title, eyebrow, children }: ISectionShell) {
  const sectionId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return (
    <Box
      aria-labelledby={sectionId}
      component="section"
      sx={{
        height: '100%',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        border: (theme) =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(220, 229, 236, 0.14)'
            : '1px solid rgba(20, 32, 44, 0.12)',
        borderRadius: { xs: '28px', md: '32px' },
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(12, 17, 23, 0.74)'
            : 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(22px)',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 24px 60px rgba(9, 18, 26, 0.18)'
            : '0 24px 60px rgba(20, 32, 44, 0.08)',
        p: { xs: 2.5, sm: 3, md: 4 }
      }}
    >
      <Box sx={{ display: 'grid', gap: 1 }}>
        {eyebrow ? (
          <Typography
            sx={{
              color: 'secondary.main',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em'
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography
          id={sectionId}
          variant="h2"
          sx={{
            fontSize: { xs: '1.55rem', sm: '1.75rem', md: '2.3rem' },
            lineHeight: 1.05
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ mt: { xs: 2.5, md: 3 }, flex: 1 }}>{children}</Box>
    </Box>
  )
}

export default SectionShell
