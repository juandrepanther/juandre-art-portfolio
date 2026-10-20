import { Close, DeleteOutlined } from '@mui/icons-material'
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material'
import type { IScoreboardEntry } from 'lib/zustand/game-scoreboard-store'

interface IScoreboardPanel {
  isDarkMode: boolean
  isVisible: boolean
  onClose: () => void
  onDeleteClick: () => void
  scoreboardEntries: IScoreboardEntry[]
}

const difficultyOrder: IScoreboardEntry['difficulty'][] = [
  'Noob',
  'Balls',
  'Hardcore',
  null
]

function formatDifficultyLabel(difficulty: IScoreboardEntry['difficulty']) {
  if (difficulty === null) {
    return 'N/A'
  }

  return difficulty
}

function groupEntriesByDifficulty(scoreboardEntries: IScoreboardEntry[]) {
  return difficultyOrder
    .map((difficulty) => ({
      difficulty,
      entries: scoreboardEntries.filter(
        (scoreboardEntry) => scoreboardEntry.difficulty === difficulty
      )
    }))
    .filter((difficultyGroup) => difficultyGroup.entries.length > 0)
}

function ScoreboardPanel({
  isDarkMode,
  isVisible,
  onClose,
  onDeleteClick,
  scoreboardEntries
}: IScoreboardPanel) {
  const groupedEntries = groupEntriesByDifficulty(scoreboardEntries)

  return (
    <Stack
      aria-hidden={!isVisible}
      data-testid="scoreboard-panel"
      spacing={1.25}
      sx={
        isVisible
          ? {
              width: 340,
              maxWidth: 'calc(100vw - 40px)',
              p: 1.5,
              borderRadius: 1.5,
              backdropFilter: 'blur(18px)',
              backgroundColor: isDarkMode
                ? 'rgba(12, 17, 23, 0.78)'
                : 'rgba(243, 245, 248, 0.84)',
              border: isDarkMode
                ? '1px solid rgba(220, 229, 236, 0.12)'
                : '1px solid rgba(20, 32, 44, 0.12)',
              boxShadow: isDarkMode
                ? '0 20px 60px rgba(0, 0, 0, 0.32)'
                : '0 20px 60px rgba(20, 32, 44, 0.18)',
              pointerEvents: 'auto'
            }
          : {
              position: 'absolute',
              width: 1,
              height: 1,
              p: 0,
              m: -1,
              opacity: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }
      }
    >
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography sx={{ color: 'secondary.main', letterSpacing: '0.1em' }}>
          SCOREBOARD
        </Typography>
        {isVisible ? (
          <IconButton
            aria-label="Close scoreboard"
            onClick={onClose}
            size="small"
          >
            <Close fontSize="small" />
          </IconButton>
        ) : null}
      </Stack>

      <Stack spacing={1}>
        {groupedEntries.map((difficultyGroup) => (
          <Stack
            key={difficultyGroup.difficulty ?? 'no-difficulty'}
            spacing={0.6}
            sx={{
              borderRadius: 1,
              px: 0.75,
              py: 0.75,
              backgroundColor: isDarkMode
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(20, 32, 44, 0.04)'
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{ color: 'text.secondary', typography: 'caption' }}
              >
                Difficulty
              </Typography>
              <Chip
                color={
                  difficultyGroup.difficulty === null ? 'default' : 'secondary'
                }
                label={formatDifficultyLabel(difficultyGroup.difficulty)}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ px: 0.5, color: 'text.secondary', typography: 'caption' }}
            >
              <Box sx={{ flex: 1.2 }}>Player</Box>
              <Box sx={{ width: 70, textAlign: 'right' }}>Defeated</Box>
            </Stack>

            <Stack spacing={0.6}>
              {difficultyGroup.entries.map((scoreboardEntry) => (
                <Stack
                  direction="row"
                  key={`${scoreboardEntry.playerName}-${scoreboardEntry.difficulty ?? 'no-difficulty'}`}
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    borderRadius: 1,
                    px: 0.75,
                    py: 0.5,
                    backgroundColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(20, 32, 44, 0.06)'
                  }}
                >
                  <Typography sx={{ flex: 1.2 }} variant="body2">
                    {scoreboardEntry.playerName}
                  </Typography>
                  <Typography
                    sx={{ width: 70, textAlign: 'right' }}
                    variant="body2"
                  >
                    {scoreboardEntry.enemiesDefeated}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" sx={{ justifyContent: 'flex-end', pt: 0.5 }}>
        <IconButton
          aria-label="Delete scoreboard data"
          color="error"
          onClick={onDeleteClick}
          size="small"
        >
          <DeleteOutlined fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default ScoreboardPanel
