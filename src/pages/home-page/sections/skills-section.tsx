import { Box, Divider, Stack, Typography } from '@mui/material'
import { generalSkills, mySkills, sectionTitles } from 'data/profile-data'
import { createInteractiveSurfaceSx } from 'utils/interactive-surface'
import SectionShell from './section-shell'

interface ISkillsSection {
  isDarkMode: boolean
}

function SkillsSection({ isDarkMode }: ISkillsSection) {
  return (
    <SectionShell eyebrow="Capabilities" title={sectionTitles[2]}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {mySkills.map((skill) => (
            <Box
              key={skill.tech}
              sx={[
                createInteractiveSurfaceSx({
                  borderOpacity: 0.12,
                  hoverBackgroundOpacity: 0.05,
                  hoverBorderOpacity: 0.2,
                  lift: 1,
                  hoverShadowOpacity: 0.1
                }),
                {
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 38,
                  maxWidth: '100%',
                  px: 1.5,
                  py: 0.9,
                  border: '1px solid transparent',
                  borderRadius: '999px'
                }
              ]}
            >
              <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.3 }}>
                {skill.tech}
              </Typography>
            </Box>
          ))}
        </Box>
        <Divider
          sx={{
            borderColor: isDarkMode
              ? 'rgba(220, 229, 236, 0.1)'
              : 'rgba(20, 32, 44, 0.1)'
          }}
        />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {generalSkills.split('|').map((skill) => (
            <Box
              key={skill}
              sx={[
                createInteractiveSurfaceSx({
                  backgroundOpacity: 0.08,
                  hoverBackgroundOpacity: 0.14,
                  lift: 1,
                  hoverShadowOpacity: 0.08
                }),
                {
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 38,
                  maxWidth: '100%',
                  px: 1.5,
                  py: 0.9,
                  borderRadius: '999px'
                }
              ]}
            >
              <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.3 }}>
                {skill.trim()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </SectionShell>
  )
}

export default SkillsSection
