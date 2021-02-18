import React, { useState, useEffect, ReactElement } from 'react'
import { Router } from '@reach/router'
import AssetContent from '../organisms/AssetContent'
import Page from './Page'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import { useAlgorithm } from '../../providers/Algorithm'

export default function PageTemplateAlgorithmDetails({
  uri
}: {
  uri: string
}): ReactElement {
  const { ddo, title, error, isInPurgatory } = useAlgorithm()
  const [pageTitle, setPageTitle] = useState<string>()

  useEffect(() => {
    if (!ddo || error) {
      setPageTitle('Could not retrieve asset')
      return
    }

    setPageTitle(isInPurgatory ? '' : title)
  }, [ddo, error, isInPurgatory, title])

  return ddo ? (
    <>
      <Page title={pageTitle} uri={uri}>
        <Router basepath="/algorithm">
          <AssetContent path=":did" />
        </Router>
      </Page>
    </>
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
