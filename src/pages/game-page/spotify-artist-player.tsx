import { Close } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

interface ISpotifyArtistPlayer {
  artistEmbedUrl: string
  onClose: () => void
  isDarkMode: boolean
}

function SpotifyArtistPlayer({
  artistEmbedUrl,
  onClose,
  isDarkMode
}: ISpotifyArtistPlayer) {
  return (
    <Box
      data-testid="spotify-artist-player"
      sx={{
        position: 'relative',
        width: 340,
        maxWidth: 'min(340px, calc(100vw - 48px))',
        p: 1.5,
        pt: 4.5,
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
          : '0 22px 60px rgba(20, 32, 44, 0.14)'
      }}
    >
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

      <Box
        component="iframe"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
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
