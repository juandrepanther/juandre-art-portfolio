import { Box, Divider, Stack, Typography } from '@mui/material'
import { experienceSteps, sectionTitles } from 'data/profile-data'
import SectionShell from './section-shell'

interface IExperienceSection {
  isDarkMode: boolean
}

function ExperienceSection({ isDarkMode }: IExperienceSection) {
  return (
    <SectionShell eyebrow="Profile" title={sectionTitles[1]}>
      <Stack spacing={3}>
        {experienceSteps.map((experienceStep, index) => (
          <Stack
            key={`${experienceStep.title}-${experienceStep.year}`}
            spacing={2}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              sx={{ justifyContent: 'space-between' }}
            >
              <Box>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 700 }}>
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
            <Stack component="ul" spacing={1} sx={{ color: 'text.secondary' }}>
              {experienceStep.responsibilities.map((responsibility) => (
                <Box component="li" key={responsibility}>
                  {responsibility.replace(/\s+/g, ' ').trim()}
                </Box>
              ))}
            </Stack>
            {index < experienceSteps.length - 1 ? (
              <Divider
                sx={{
                  borderColor: isDarkMode
                    ? 'rgba(220, 229, 236, 0.1)'
                    : 'rgba(20, 32, 44, 0.1)'
                }}
              />
            ) : null}
          </Stack>
        ))}
      </Stack>
    </SectionShell>
  )
}

export default ExperienceSection
