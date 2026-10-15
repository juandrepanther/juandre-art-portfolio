import { Box, Stack, Typography } from '@mui/material'
import { educationAndCourses, sectionTitles } from 'data/profile-data'
import SectionShell from './section-shell'

function EducationSection() {
  return (
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
            <Typography sx={{ color: 'secondary.main', whiteSpace: 'nowrap' }}>
              {educationItem.year}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </SectionShell>
  )
}

export default EducationSection
