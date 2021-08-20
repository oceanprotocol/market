import React, { ReactElement } from 'react'
import ReactPlayer from 'react-player'

export default function VideoPlayer({
  videoUrl
}: {
  videoUrl: string
}): ReactElement {
  return (
    <div>
      <ReactPlayer url={videoUrl} controls pip />
    </div>
  )
}
