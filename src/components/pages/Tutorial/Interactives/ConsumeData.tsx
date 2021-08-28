import React, { useState, useEffect, ReactElement } from 'react'
import Page from '../../../templates/Page'
import Alert from '../../../atoms/Alert'
import Loader from '../../../atoms/Loader'
import { useAsset } from '../../../../providers/Asset'
import AssetActions from '../../../organisms/AssetActions'
import styles from '../../../organisms/AssetContent/index.module.css'

export default function ConsumeData({
  showPriceTutorial,
  showComputeTutorial
}: {
  showPriceTutorial: boolean
  showComputeTutorial: boolean
}): ReactElement {
  const { ddo, title, error, isInPurgatory, loading } = useAsset()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (!ddo || error) {
      setPageTitle('Could not retrieve asset')
      return
    }

    setPageTitle(isInPurgatory ? '' : title)
  }, [ddo, error, isInPurgatory, title])

  return (
    <>
      {showPriceTutorial &&
      showComputeTutorial &&
      ddo &&
      pageTitle !== undefined &&
      !loading ? (
        <Page title={pageTitle} uri="/tutorial">
          <div className={styles.actions}>
            <AssetActions />
          </div>
        </Page>
      ) : error ? (
        <Page title={pageTitle} noPageHeader uri="/tutorial">
          <Alert title={pageTitle} text={error} state="error" />
        </Page>
      ) : (
        <Page title={undefined} uri="/tutorial">
          <Loader />
        </Page>
      )}
    </>
  )
}
