import React from 'react'
import { ReactElement } from 'react-markdown'
import Page from '../../../templates/Page'
import PageHistory from '../../History'

export default function Chapter11(): ReactElement {
  return (
    <Page
      title="History"
      description="Find the data sets and jobs that you previously accessed."
      uri="/tutorial"
    >
      <PageHistory />
    </Page>
  )
}
