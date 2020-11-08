import React, { ReactElement } from 'react'

import {
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton
} from 'react-share'
export default function Share({ did }: { did: string }): ReactElement {
  const assetUrl = `https://market.oceanprotocol.com/asset/${did}`
  const quote = 'Check out this asset on the ocean market!'
  const hashtags = ['oceanprotocol']
  return (
    <>
      <FacebookShareButton url={assetUrl} quote={quote}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={assetUrl} title={quote} hashtags={hashtags}>
        <TwitterIcon size={32} round />{' '}
      </TwitterShareButton>
      <RedditShareButton
        url={assetUrl}
        title={quote}
        windowWidth={660}
        windowHeight={460}
      >
        <RedditIcon size={32} round />
      </RedditShareButton>
      <TelegramShareButton url={assetUrl} title={quote}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>
    </>
  )
}
