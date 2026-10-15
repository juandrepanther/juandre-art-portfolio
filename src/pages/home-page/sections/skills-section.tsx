import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography
} from '@mui/material'
import { generalSkills, mySkills, sectionTitles } from 'data/profile-data'
import SectionShell from './section-shell'

interface ISkillsSection {
  isDarkMode: boolean
}

function SkillsSection({ isDarkMode }: ISkillsSection) {
  return (
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
  )
}

export default SkillsSection
