import { Box } from '@mui/material'

interface ISpotifyArtistPlayer {
  artistEmbedUrl: string
  isDarkMode: boolean
}

function SpotifyArtistPlayer({
  artistEmbedUrl,
  isDarkMode
}: ISpotifyArtistPlayer) {
  return (
    <Box
      data-testid="spotify-artist-player"
      sx={{
        width: 340,
        maxWidth: 'min(340px, calc(100vw - 48px))',
        p: 1.5,
        borderRadius: 4,
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
          borderRadius: 3,
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
