import { useAsset } from '@context/Asset'
import React from 'react'
import { useWeb3 } from '@context/Web3'
import { calicaUri } from 'app.config'
export default function CalicaIntegration() {
  const { isOwner } = useAsset()
  const { accountId } = useWeb3()

  return isOwner ? (
    <a
      href={`${calicaUri}/${accountId}`}
      target="_blank"
      rel="noreferrer"
      title="Use Calica for revenue split"
    >
      Use Calica for revenue split
    </a>
  ) : (
    <></>
  )
}
