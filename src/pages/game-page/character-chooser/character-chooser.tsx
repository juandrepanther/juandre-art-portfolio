import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, Button, Chip, IconButton, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import logoVnImage from 'assets/images/logo_vn.jpg'
import { createInteractiveSurfaceSx } from 'utils/interactive-surface'
import type {
  ICharacterConfig,
  TCharacterId,
  TDifficultyLevel
} from '../settings'
import CharacterPreview from './character-preview'

interface ICharacterChooser {
  availableCharacterIds: TCharacterId[]
  onCharacterChange: (characterId: TCharacterId) => void
  onDifficultyChange: (difficulty: TDifficultyLevel) => void
  onChoose: () => void
  selectedCharacterConfig: ICharacterConfig
  selectedDifficulty: TDifficultyLevel
}

function CharacterChooser({
  availableCharacterIds,
  onCharacterChange,
  onDifficultyChange,
  onChoose,
  selectedCharacterConfig,
  selectedDifficulty
}: ICharacterChooser) {
  const theme = useTheme()
  const selectedIndex = availableCharacterIds.indexOf(
    selectedCharacterConfig.id
  )
  const totalCharacters = availableCharacterIds.length
  const difficultyOptions: TDifficultyLevel[] = ['Noob', 'Balls', 'Hardcore']

  const moveSelection = (direction: -1 | 1) => {
    if (totalCharacters <= 1) {
      return
    }

    const nextIndex =
      (selectedIndex + direction + totalCharacters) % totalCharacters
    onCharacterChange(availableCharacterIds[nextIndex])
  }

  return (
    <Box
      data-testid="character-chooser"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 7,
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 4 },
        overflowY: 'auto',
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.72)} 0%, ${alpha(theme.palette.background.paper, 0.84)} 100%)`,
        backdropFilter: 'blur(20px)'
      }}
    >
      <Stack
        spacing={3}
        sx={{
          width: 'min(1120px, 100%)',
          maxHeight: '100%',
          overflowY: 'auto',
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.88)} 0%, ${alpha(theme.palette.background.default, 0.78)} 100%)`,
          boxShadow: `0 28px 90px ${alpha(theme.palette.common.black, 0.34)}`
        }}
      >
        <Stack spacing={1.25}>
          <Typography sx={{ color: 'secondary.main', letterSpacing: '0.18em' }}>
            CHARACTER SELECT
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={3}
          sx={{ alignItems: 'stretch' }}
        >
          <Stack
            spacing={2.5}
            sx={{
              flex: 1.2,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ width: '100%' }}>
              <CharacterPreview characterConfig={selectedCharacterConfig} />
            </Box>

            <Box
              component="img"
              alt="VN logo"
              src={logoVnImage}
              sx={{
                width: { xs: 120, md: 168 },
                maxWidth: '24%',
                height: 'auto',
                objectFit: 'contain',
                filter: `drop-shadow(0 14px 30px ${alpha(theme.palette.common.black, 0.18)})`,
                borderRadius: 2
              }}
            />
          </Stack>

          <Stack spacing={2.5} sx={{ flex: 0.95, minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <IconButton
                aria-label="Show previous character"
                color="secondary"
                disabled={totalCharacters <= 1}
                onClick={() => moveSelection(-1)}
              >
                <ChevronLeft />
              </IconButton>

              <Chip
                color="secondary"
                label={`Character ${selectedIndex + 1} / ${totalCharacters}`}
                sx={{ letterSpacing: '0.06em' }}
              />

              <IconButton
                aria-label="Show next character"
                color="secondary"
                disabled={totalCharacters <= 1}
                onClick={() => moveSelection(1)}
              >
                <ChevronRight />
              </IconButton>
            </Stack>

            <Stack
              spacing={2}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                ...createInteractiveSurfaceSx({
                  backgroundOpacity: 0.04,
                  hoverBackgroundOpacity: 0.06,
                  borderOpacity: 0.14,
                  hoverBorderOpacity: 0.2,
                  shadowOpacity: 0.12,
                  hoverShadowOpacity: 0.18
                })(theme)
              }}
            >
              <Box>
                <Typography variant="h3">
                  {selectedCharacterConfig.label}
                </Typography>
                <Typography
                  sx={{ color: 'text.secondary', mt: 1.25, lineHeight: 1.8 }}
                >
                  {selectedCharacterConfig.description}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                <Chip color="primary" label="Brutal kill" variant="outlined" />
              </Stack>
            </Stack>

            <Stack
              spacing={2}
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                ...createInteractiveSurfaceSx({
                  backgroundOpacity: 0.04,
                  hoverBackgroundOpacity: 0.06,
                  borderOpacity: 0.14,
                  hoverBorderOpacity: 0.2,
                  shadowOpacity: 0.12,
                  hoverShadowOpacity: 0.18
                })(theme)
              }}
            >
              <Box>
                <Typography
                  sx={{ color: 'text.secondary', mt: 1.25, lineHeight: 1.8 }}
                >
                  Pick a difficulty
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {difficultyOptions.map((difficultyOption) => (
                    <Button
                      color="secondary"
                      key={difficultyOption}
                      onClick={() => onDifficultyChange(difficultyOption)}
                      variant={
                        difficultyOption === selectedDifficulty
                          ? 'contained'
                          : 'outlined'
                      }
                    >
                      {difficultyOption}
                    </Button>
                  ))}
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', alignItems: 'center' }}
                >
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    Move:
                  </Typography>
                  <Chip color="warning" label="WASD" size="small" />
                  <Chip color="warning" label="Arrow keys" size="small" />
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    Jump:
                  </Typography>
                  <Chip color="warning" label="Space" size="small" />
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', alignItems: 'center' }}
                >
                  <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    Pointer:
                  </Typography>
                  <Chip color="warning" label="Esc" size="small" />
                  <Chip color="warning" label="Click the scene" size="small" />
                </Stack>
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                color="error"
                onClick={onChoose}
                size="large"
                variant="contained"
              >
                Choose
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default CharacterChooser
