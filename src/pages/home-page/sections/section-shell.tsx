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
        display: 'flex',
        flexDirection: 'column',
        border: (theme) =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(220, 229, 236, 0.14)'
            : '1px solid rgba(20, 32, 44, 0.12)',
        borderRadius: '32px',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(12, 17, 23, 0.74)'
            : 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(22px)',
        p: { xs: 3, md: 4 }
      }}
    >
      <Box sx={{ display: 'grid', gap: 1 }}>
        {eyebrow ? (
          <Typography
            sx={{
              color: 'secondary.main',
              fontSize: '0.8rem',
              letterSpacing: '0.16em'
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography
          id={sectionId}
          variant="h2"
          sx={{ fontSize: { xs: '1.65rem', md: '2.3rem' } }}
        >
          {title}
        </Typography>
      </Box>
      <Box sx={{ mt: { xs: 2.5, md: 3 }, flex: 1 }}>{children}</Box>
    </Box>
  )
}

export default SectionShell
