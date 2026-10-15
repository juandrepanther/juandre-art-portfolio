import { Chip, Divider, Stack } from '@mui/material'
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
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {mySkills.map((skill) => (
            <Chip
              key={skill.tech}
              label={skill.tech}
              variant="outlined"
              sx={[
                createInteractiveSurfaceSx({
                  borderOpacity: 0.12,
                  hoverBackgroundOpacity: 0.05,
                  hoverBorderOpacity: 0.2,
                  lift: 1,
                  hoverShadowOpacity: 0.1
                }),
                {
                  borderRadius: '999px',
                  px: 0.5,
                  py: 0.25
                }
              ]}
            />
          ))}
        </Stack>
        <Divider
          sx={{
            borderColor: isDarkMode
              ? 'rgba(220, 229, 236, 0.1)'
              : 'rgba(20, 32, 44, 0.1)'
          }}
        />
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {generalSkills.split('|').map((skill) => (
            <Chip
              key={skill}
              label={skill.trim()}
              sx={[
                createInteractiveSurfaceSx({
                  backgroundOpacity: 0.08,
                  hoverBackgroundOpacity: 0.14,
                  lift: 1,
                  hoverShadowOpacity: 0.08
                }),
                {
                  borderRadius: '999px'
                }
              ]}
            />
          ))}
        </Stack>
      </Stack>
    </SectionShell>
  )
}

export default SkillsSection
