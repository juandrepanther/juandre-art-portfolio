import { Tooltip } from '@mui/material'
import React from 'react'

//@IMPORTANT - MAIN LOGIC for playing and pause audio is in VideoApply.tsx file

const audioTrack =
  'https://spp-microsites-assets.s3-accelerate.amazonaws.com/spp-igd-3d-interactive/audio/MusicTrack.mp3'

const AudioPlayer = () => {
  console.log('Audio Player re-render')
  return (
    <Tooltip
      placement="bottom"
      title="Feel that sound while surfing in the 3D World"
    >
      <div className="audio-player">
        <audio
          autoPlay
          controls
          controlsList="noplaybackrate nodownload nofullscreen"
        >
          <source src={audioTrack} type="audio/mpeg" />
        </audio>
      </div>
    </Tooltip>
  )
}

export default AudioPlayer
