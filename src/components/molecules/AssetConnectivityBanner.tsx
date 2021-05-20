import { DDO, DID } from '@oceanprotocol/lib'
import axios, { CancelTokenSource } from 'axios'
import React, { ReactElement, useEffect, useState } from 'react'
import { isFileValid } from '../../utils/provider'
import AnnouncementBanner from '../atoms/AnnouncementBanner'

export default function AssetConnectivityBanner({
  ddo,
  selectedAlgorithmDDO
}: {
  ddo: DDO
  selectedAlgorithmDDO?: DDO
}): ReactElement {
  const [fileConnectivity, setFileConnectivity] = useState<boolean>(true)
  const [
    algorithmFileConnectivity,
    setAlgorithmFileConnectivity
  ] = useState<boolean>(true)

  async function validateAsset(
    ddo: DDO,
    source: CancelTokenSource,
    isAlgorithm?: boolean
  ) {
    const did = DID.parse(ddo.id)
    const fileValid = await isFileValid(
      did,
      ddo.findServiceByType('access')?.serviceEndpoint ||
        ddo.findServiceByType('compute')?.serviceEndpoint,
      source.token
    )

    if (isAlgorithm) setAlgorithmFileConnectivity(fileValid)
    else setFileConnectivity(fileValid)
  }

  useEffect(() => {
    const source = axios.CancelToken.source()
    validateAsset(ddo, source)
    return () => {
      source.cancel()
    }
  }, [ddo])

  useEffect(() => {
    if (!selectedAlgorithmDDO) return
    const source = axios.CancelToken.source()
    validateAsset(selectedAlgorithmDDO, source, true)
    return () => {
      source.cancel()
    }
  }, [selectedAlgorithmDDO])

  let offlineAsset

  if (!fileConnectivity && algorithmFileConnectivity === false)
    offlineAsset = 'Dataset and selected Algorithm'
  else if (!fileConnectivity) offlineAsset = 'Dataset'
  else if (algorithmFileConnectivity === false) offlineAsset = 'Algorithm'
  else return null

  return (
    <AnnouncementBanner
      text={`${offlineAsset} is offline, consume at your own risk.`}
      state="error"
    />
  )
}
