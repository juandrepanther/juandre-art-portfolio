import { Close } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Typography } from '@mui/material'
import { useState } from 'react'

interface ISpotifyArtistPlayer {
  artistEmbedUrl: string
  onClose: () => void
  isDarkMode: boolean
  isVisible: boolean
}

function SpotifyArtistPlayer({
  artistEmbedUrl,
  onClose,
  isDarkMode,
  isVisible
}: ISpotifyArtistPlayer) {
  const [loadedEmbedUrl, setLoadedEmbedUrl] = useState<string | null>(null)
  const isEmbedLoading = loadedEmbedUrl !== artistEmbedUrl

  return (
    <Box
      data-testid="spotify-artist-player"
      aria-hidden={!isVisible}
      sx={{
        position: isVisible ? 'relative' : 'absolute',
        width: isVisible ? 340 : 1,
        maxWidth: 'min(340px, calc(100vw - 48px))',
        height: isVisible ? 'auto' : 1,
        p: isVisible ? 1.5 : 0,
        pt: isVisible ? 4.5 : 0,
        borderRadius: 2,
        backdropFilter: 'blur(18px)',
        backgroundColor: isDarkMode
          ? 'rgba(12, 17, 23, 0.62)'
          : 'rgba(243, 245, 248, 0.72)',
        border: isDarkMode
          ? '1px solid rgba(220, 229, 236, 0.12)'
          : '1px solid rgba(20, 32, 44, 0.12)',
        boxShadow: isDarkMode
          ? '0 22px 60px rgba(0, 0, 0, 0.28)'
          : '0 22px 60px rgba(20, 32, 44, 0.14)',
        ...(isVisible
          ? {}
          : {
              overflow: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
              whiteSpace: 'nowrap'
            })
      }}
    >
      {isVisible ? (
        <IconButton
          aria-label="Close Spotify player"
          color="inherit"
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            color: 'text.secondary'
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      ) : null}

      {isVisible && isEmbedLoading ? (
        <Box
          data-testid="spotify-player-loader"
          role="status"
          aria-busy="true"
          aria-live="polite"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2,
            backgroundColor: isDarkMode
              ? 'rgba(9, 14, 20, 0.48)'
              : 'rgba(255, 255, 255, 0.54)',
            backdropFilter: 'blur(6px)',
            pointerEvents: 'none'
          }}
        >
          <Box sx={{ display: 'grid', justifyItems: 'center', gap: 1 }}>
            <CircularProgress
              aria-label="Loading Spotify player"
              color="success"
              size={28}
            />
            <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
              Loading Spotify...
            </Typography>
          </Box>
        </Box>
      ) : null}

      <Box
        component="iframe"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
        onLoad={() => setLoadedEmbedUrl(artistEmbedUrl)}
        src={artistEmbedUrl}
        title="Spotify artist player"
        sx={{
          display: 'block',
          width: '100%',
          height: 352,
          border: 0,
          borderRadius: 1.5,
          overflow: 'hidden',
          backgroundColor: isDarkMode
            ? 'rgba(12, 17, 23, 0.8)'
            : 'rgba(255, 255, 255, 0.88)'
        }}
      />
    </Box>
  )
}

export default SpotifyArtistPlayer
