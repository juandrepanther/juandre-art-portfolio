import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { alpha, keyframes, useTheme } from '@mui/material/styles'
import { useRef, type SyntheticEvent } from 'react'
import chooserBackgroundImage from 'assets/images/bg.jpg'
import logoVnImage from 'assets/images/logo_vn.jpg'
import { createInteractiveSurfaceSx } from 'utils/interactive-surface'
import type {
  ICharacterConfig,
  TCharacterId,
  TDevLevelOption,
  TDifficultyLevel
} from '../settings'
import type { TGameMode } from '../helpers'
import CharacterPreview from './character-preview'

interface ICharacterChooser {
  availableCharacterIds: TCharacterId[]
  isLandscapeMobile: boolean
  isMobileViewport: boolean
  onCharacterChange: (characterId: TCharacterId) => void
  onDevChoose: () => void
  onDifficultyChange: (difficulty: TDifficultyLevel) => void
  onDevLevelChange: (levelId: TDevLevelOption) => void
  onGameModeChange: (gameMode: TGameMode) => void
  onPlayerNameChange: (playerName: string) => void
  onChoose: () => void
  playerName: string
  playerNameOptions: string[]
  selectedDevLevel: TDevLevelOption
  selectedGameMode: TGameMode
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
  isLandscapeMobile,
  isMobileViewport,
  onCharacterChange,
  onDevChoose,
  onDevLevelChange,
  onDifficultyChange,
  onGameModeChange,
  onPlayerNameChange,
  onChoose,
  playerName,
  playerNameOptions,
  selectedDevLevel,
  selectedGameMode,
  selectedCharacterConfig,
  selectedDifficulty
}: ICharacterChooser) {
  const theme = useTheme()
  const isMobileLandscape = isMobileViewport && isLandscapeMobile
  const selectedIndex = availableCharacterIds.indexOf(
    selectedCharacterConfig.id
  )
  const totalCharacters = availableCharacterIds.length
  const difficultyOptions: TDifficultyLevel[] = ['Noob', 'Balls', 'Hardcore']
  const gameModeOptions: TGameMode[] = ['Survive', 'Levels']
  const levelOptions: TDevLevelOption[] = [1, 2, 3, 4, 5, 6, 7, 'Boss']
  const isChooseDisabled = playerName.trim().length === 0
  const isLevelsMode = selectedGameMode === 'Levels'
  const isDevelopmentEnvironment = import.meta.env.DEV
  const shouldShowPlayerNameError =
    playerNameOptions.length === 0 && playerName.trim().length === 0
  const playerNameInputRef = useRef<HTMLInputElement | null>(null)

  const handlePlayerNameSelection = (
    _: SyntheticEvent,
    nextPlayerName: string | null,
    reason: string
  ) => {
    onPlayerNameChange(nextPlayerName ?? '')

    if (isMobileViewport && reason === 'selectOption') {
      requestAnimationFrame(() => {
        playerNameInputRef.current?.blur()
      })
    }
  }

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
        display: isMobileLandscape ? 'flex' : 'grid',
        placeItems: isMobileLandscape ? undefined : 'center',
        alignItems: isMobileLandscape ? 'stretch' : undefined,
        px: isMobileLandscape ? 0 : isMobileViewport ? 0 : { xs: 2, md: 4 },
        py: isMobileLandscape ? 0 : isMobileViewport ? 0 : { xs: 3, md: 4 },
        overflowY: isMobileLandscape ? 'hidden' : 'auto',
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.72)} 0%, ${alpha(theme.palette.background.paper, 0.84)} 100%)`,
        backdropFilter: 'blur(20px)'
      }}
    >
      <Stack
        spacing={3}
        sx={{
          width: 'min(1120px, 100%)',
          height: isMobileLandscape ? '100%' : 'auto',
          maxHeight: '100%',
          overflowY: isMobileLandscape ? 'hidden' : 'auto',
          justifyContent: isMobileLandscape ? 'space-between' : 'flex-start',
          p: isMobileViewport ? 0.5 : { xs: 3, md: 4 },
          borderRadius: isMobileViewport ? 0.5 : 3,
          border: 'none',
          backgroundImage: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.7)} 100%), url(${chooserBackgroundImage})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
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
          sx={{
            alignItems: 'stretch',
            minHeight: isMobileLandscape ? 0 : undefined
          }}
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
                isLandscapeMobile={isLandscapeMobile}
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
                onChange={handlePlayerNameSelection}
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
                    inputRef={playerNameInputRef}
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
                    onChange={handlePlayerNameSelection}
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
                        inputRef={playerNameInputRef}
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
                      disabled={isLevelsMode}
                      key={difficultyOption}
                      onClick={() => onDifficultyChange(difficultyOption)}
                      size={isMobileViewport ? 'small' : 'medium'}
                      variant={
                        difficultyOption === selectedDifficulty
                          ? 'contained'
                          : 'outlined'
                      }
                      sx={
                        isMobileViewport
                          ? {
                              px: 0.85,
                              py: 0.25,
                              minWidth: 56,
                              fontSize: '0.68rem'
                            }
                          : undefined
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
                    <Stack spacing={0.8} sx={{ width: '100%', maxWidth: 460 }}>
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          lineHeight: 1.6
                        }}
                      >
                        Game setup:
                      </Typography>
                      <Stack direction="row" spacing={1.2}>
                        <FormControl size="small" fullWidth>
                          <InputLabel id="game-mode-select-label">
                            Game modes
                          </InputLabel>
                          <Select<TGameMode>
                            label="Game modes"
                            labelId="game-mode-select-label"
                            onChange={(e) => {
                              onGameModeChange(e.target.value)
                            }}
                            value={selectedGameMode}
                          >
                            {gameModeOptions.map((gameModeOption) => (
                              <MenuItem
                                key={gameModeOption}
                                value={gameModeOption}
                              >
                                {gameModeOption}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {isDevelopmentEnvironment ? (
                          <FormControl size="small" fullWidth>
                            <InputLabel id="dev-level-select-label">
                              DEV level
                            </InputLabel>
                            <Select<TDevLevelOption>
                              disabled={!isLevelsMode}
                              label="DEV level"
                              labelId="dev-level-select-label"
                              onChange={(e) => {
                                onDevLevelChange(e.target.value)
                              }}
                              value={selectedDevLevel}
                            >
                              {levelOptions.map((levelOption) => (
                                <MenuItem key={levelOption} value={levelOption}>
                                  {levelOption === 'Boss'
                                    ? 'Boss'
                                    : `Level ${levelOption}`}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : null}
                      </Stack>
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
              {isDevelopmentEnvironment ? (
                <Tooltip
                  disableHoverListener={!isChooseDisabled}
                  title="Type a player name or choose one from the list"
                >
                  <span>
                    <Button
                      color="warning"
                      disabled={isChooseDisabled}
                      onClick={onDevChoose}
                      size={isMobileViewport ? 'small' : 'large'}
                      variant="outlined"
                      sx={
                        isMobileViewport
                          ? {
                              px: 1,
                              py: 0.35,
                              minWidth: 48,
                              fontSize: '0.72rem'
                            }
                          : undefined
                      }
                    >
                      DEV
                    </Button>
                  </span>
                </Tooltip>
              ) : null}
              <Tooltip
                disableHoverListener={!isChooseDisabled}
                title="Type a player name or choose one from the list"
              >
                <span>
                  <Button
                    color="error"
                    disabled={isChooseDisabled}
                    onClick={onChoose}
                    size={isMobileViewport ? 'small' : 'large'}
                    variant="contained"
                    sx={
                      isMobileViewport
                        ? {
                            px: 1.25,
                            py: 0.35,
                            minWidth: 70,
                            fontSize: '0.72rem'
                          }
                        : undefined
                    }
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
