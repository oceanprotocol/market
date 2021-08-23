import React, { useState, useEffect, ReactElement } from 'react'
import Page from './Page'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import { useAsset } from '../../providers/Asset'
import AssetActions from '../organisms/AssetActions'
import styles from '../organisms/AssetContent/index.module.css'
import { BestPrice } from '@oceanprotocol/lib'

export default function AssetActionsWrapper({
  uri,
  setPrice
}: {
  uri: string
  setPrice?: (value: BestPrice) => void
}): ReactElement {
  const { ddo, title, error, isInPurgatory, loading, refreshDdo, price } =
    useAsset()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (!ddo || error) {
      setPageTitle('Could not retrieve asset')
      return
    }

    setPageTitle(isInPurgatory ? '' : title)
  }, [ddo, error, isInPurgatory, title])
  console.log(ddo)
  useEffect(() => {
    const updateAsset = async () => {
      await refreshDdo()
      setPrice(price)
    }
    if (
      !price?.address ||
      ddo?.service[1].attributes.main.privacy.publisherTrustedAlgorithms
        .length === 0
    )
      updateAsset()
  }, [price])

  return ddo && pageTitle !== undefined && !loading ? (
    <Page title={pageTitle} uri={uri}>
      <div className={styles.actions}>
        <AssetActions />
      </div>
    </Page>
  ) : error ? (
    <Page title={pageTitle} noPageHeader uri={uri}>
      <Alert title={pageTitle} text={error} state="error" />
    </Page>
  ) : (
    <Page title={undefined} uri={uri}>
      <Loader />
    </Page>
  )
}
