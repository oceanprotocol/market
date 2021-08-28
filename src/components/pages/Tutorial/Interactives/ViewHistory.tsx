import React from 'react'
import { ReactElement } from 'react-markdown'
import Page from '../../../templates/Page'
import PageHistory from '../../History'

export default function ViewHistory({
  showPriceTutorial,
  showComputeTutorial
}: {
  showPriceTutorial: boolean
  showComputeTutorial: boolean
}): ReactElement {
  return (
    <>
      {showPriceTutorial && showComputeTutorial && (
        <Page
          title="History"
          description="Find the data sets and jobs that you previously accessed."
          uri="/tutorial"
        >
          <PageHistory />
        </Page>
      )}
    </>
  )
}
