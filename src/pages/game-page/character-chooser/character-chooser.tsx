import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { alpha, keyframes, useTheme } from '@mui/material/styles'
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
  isMobileViewport: boolean
  onCharacterChange: (characterId: TCharacterId) => void
  onDifficultyChange: (difficulty: TDifficultyLevel) => void
  onPlayerNameChange: (playerName: string) => void
  onChoose: () => void
  playerName: string
  playerNameOptions: string[]
  selectedCharacterConfig: ICharacterConfig
  selectedDifficulty: TDifficultyLevel
}

const difficultyLabelPulse = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
`

function CharacterChooser({
  availableCharacterIds,
  isMobileViewport,
  onCharacterChange,
  onDifficultyChange,
  onPlayerNameChange,
  onChoose,
  playerName,
  playerNameOptions,
  selectedCharacterConfig,
  selectedDifficulty
}: ICharacterChooser) {
  const theme = useTheme()
  const selectedIndex = availableCharacterIds.indexOf(
    selectedCharacterConfig.id
  )
  const totalCharacters = availableCharacterIds.length
  const difficultyOptions: TDifficultyLevel[] = ['Noob', 'Balls', 'Hardcore']
  const isChooseDisabled = playerName.trim().length === 0
  const shouldShowPlayerNameError =
    playerNameOptions.length === 0 && playerName.trim().length === 0

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
        px: isMobileViewport ? 0 : { xs: 2, md: 4 },
        py: isMobileViewport ? 0 : { xs: 3, md: 4 },
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
          p: isMobileViewport ? 0 : { xs: 3, md: 4 },
          borderRadius: isMobileViewport ? 0.5 : 3,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.88)} 0%, ${alpha(theme.palette.background.default, 0.78)} 100%)`,
          boxShadow: `0 28px 90px ${alpha(theme.palette.common.black, 0.34)}`
        }}
      >
        {!isMobileViewport ? (
          <Stack spacing={1.25}>
            <Typography
              sx={{ color: 'secondary.main', letterSpacing: '0.18em' }}
            >
              SELECT A WARRIOR
            </Typography>
          </Stack>
        ) : null}

        <Stack
          direction={isMobileViewport ? 'row' : { xs: 'column', lg: 'row' }}
          spacing={isMobileViewport ? 1.5 : 3}
          sx={{ alignItems: 'stretch' }}
        >
          <Stack
            spacing={isMobileViewport ? 1.2 : 2.5}
            sx={{
              flex: isMobileViewport ? 0.7 : 1.2,
              minWidth: isMobileViewport ? 180 : 240,
              alignItems: isMobileViewport ? 'stretch' : 'center',
              justifyContent: isMobileViewport ? 'space-between' : 'flex-start',
              minHeight: isMobileViewport ? '100%' : undefined
            }}
          >
            <Box
              sx={{
                width: isMobileViewport ? '100%' : '100%',
                maxWidth: '100%'
              }}
            >
              <CharacterPreview
                characterConfig={selectedCharacterConfig}
                isMobileViewport={isMobileViewport}
              />
            </Box>

            <Stack
              direction="row"
              spacing={isMobileViewport ? 0.5 : 1}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
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
                size={isMobileViewport ? 'small' : 'medium'}
                sx={{
                  letterSpacing: '0.06em',
                  '& .MuiChip-label': {
                    fontSize: isMobileViewport ? 11 : undefined
                  }
                }}
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

            {!isMobileViewport ? (
              <Autocomplete
                freeSolo
                fullWidth
                inputValue={playerName}
                onChange={(_, nextPlayerName) => {
                  onPlayerNameChange(nextPlayerName ?? '')
                }}
                onInputChange={(_, nextPlayerNameInput) => {
                  onPlayerNameChange(nextPlayerNameInput)
                }}
                options={playerNameOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    color="secondary"
                    error={shouldShowPlayerNameError}
                    helperText={
                      shouldShowPlayerNameError
                        ? 'Type any player name to start'
                        : undefined
                    }
                    label="Player name"
                    size="small"
                  />
                )}
                sx={{ width: '100%' }}
                value={playerName}
              />
            ) : null}
          </Stack>

          <Stack
            spacing={isMobileViewport ? 1.2 : 2.5}
            sx={{ flex: isMobileViewport ? 1.3 : 0.95, minWidth: 0 }}
          >
            <Stack
              spacing={2}
              sx={{
                position: 'relative',
                p: isMobileViewport ? 1.25 : 2,
                pr: { xs: 2, md: 11 },
                borderRadius: isMobileViewport ? 0.5 : 2,
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
              {isMobileViewport ? (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexWrap: 'nowrap'
                  }}
                >
                  <Box
                    component="img"
                    alt="VN logo"
                    src={logoVnImage}
                    sx={{
                      width: 48,
                      height: 'auto',
                      objectFit: 'contain',
                      filter: `drop-shadow(0 14px 30px ${alpha(theme.palette.common.black, 0.18)})`,
                      borderRadius: 2
                    }}
                  />

                  <Box>
                    <Typography variant="h5">
                      {selectedCharacterConfig.label}
                    </Typography>
                  </Box>

                  <Autocomplete
                    freeSolo
                    inputValue={playerName}
                    onChange={(_, nextPlayerName) => {
                      onPlayerNameChange(nextPlayerName ?? '')
                    }}
                    onInputChange={(_, nextPlayerNameInput) => {
                      onPlayerNameChange(nextPlayerNameInput)
                    }}
                    options={playerNameOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        color="secondary"
                        error={shouldShowPlayerNameError}
                        helperText={
                          shouldShowPlayerNameError
                            ? 'Type any player name to start'
                            : undefined
                        }
                        label="Player name"
                        size="small"
                      />
                    )}
                    size="small"
                    sx={{
                      minWidth: 120,
                      width: 160,
                      maxWidth: '100%'
                    }}
                    value={playerName}
                  />
                </Stack>
              ) : (
                <>
                  <Box
                    component="img"
                    alt="VN logo"
                    src={logoVnImage}
                    sx={{
                      position: { xs: 'static', md: 'absolute' },
                      top: { md: 16 },
                      right: { md: 16 },
                      alignSelf: { xs: 'flex-start', md: 'auto' },
                      width: { xs: 72, md: 84 },
                      height: 'auto',
                      objectFit: 'contain',
                      filter: `drop-shadow(0 14px 30px ${alpha(theme.palette.common.black, 0.18)})`,
                      borderRadius: 2,
                      mb: { xs: 1.5, md: 0 }
                    }}
                  />

                  <Box>
                    <Typography variant="h3">
                      {selectedCharacterConfig.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        mt: 1.25,
                        lineHeight: 1.8
                      }}
                    >
                      {selectedCharacterConfig.description}
                    </Typography>
                  </Box>
                </>
              )}

              {!isMobileViewport ? (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Chip
                    color="primary"
                    label="Great choice"
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              ) : null}
            </Stack>

            <Stack
              spacing={2}
              sx={{
                p: isMobileViewport ? 1.25 : 2,
                borderRadius: isMobileViewport ? 0.5 : 2,
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
                  sx={{
                    color: 'text.secondary',
                    mt: isMobileViewport ? 0.6 : 1.25,
                    lineHeight: isMobileViewport ? 1.6 : 1.8,
                    fontSize: isMobileViewport ? 12 : undefined,
                    fontWeight: 800,
                    display: 'inline-block',
                    animation: `${difficultyLabelPulse} 1.8s ease-in-out infinite`
                  }}
                >
                  Pick a difficulty
                </Typography>
              </Box>

              <Stack spacing={isMobileViewport ? 1 : 1.5}>
                <Stack
                  direction="row"
                  spacing={isMobileViewport ? 0.6 : 1}
                  sx={{ flexWrap: 'wrap' }}
                >
                  {difficultyOptions.map((difficultyOption) => (
                    <Button
                      color="info"
                      key={difficultyOption}
                      onClick={() => onDifficultyChange(difficultyOption)}
                      size={isMobileViewport ? 'small' : 'medium'}
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

                {!isMobileViewport ? (
                  <>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: 'wrap', alignItems: 'center' }}
                    >
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        Move:
                      </Typography>
                      <Chip color="warning" label="WASD" size="small" />
                      <Chip color="warning" label="Arrow keys" size="small" />
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        Jump:
                      </Typography>
                      <Chip color="warning" label="Space" size="small" />
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: 'wrap', alignItems: 'center' }}
                    >
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        Pointer:
                      </Typography>
                      <Chip color="warning" label="Esc" size="small" />
                      <Chip
                        color="warning"
                        label="Click the scene"
                        size="small"
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ flexWrap: 'wrap', alignItems: 'center' }}
                    >
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        Shot:
                      </Typography>
                      <Chip color="warning" label="Left Click" size="small" />
                    </Stack>
                  </>
                ) : null}
              </Stack>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Tooltip
                disableHoverListener={!isChooseDisabled}
                title="Type a player name or choose one from the list"
              >
                <span>
                  <Button
                    color="error"
                    disabled={isChooseDisabled}
                    onClick={onChoose}
                    size={isMobileViewport ? 'medium' : 'large'}
                    variant="contained"
                  >
                    Choose
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default CharacterChooser
