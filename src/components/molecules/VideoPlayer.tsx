import React, { ReactElement } from 'react'
import ReactPlayer from 'react-player'

export default function VideoPlayer({
  videoUrl
}: {
  videoUrl: string
}): ReactElement {
  return <ReactPlayer url={videoUrl} controls pip width="100%" />
}
