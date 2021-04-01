import React, { ReactElement } from 'react'
import PageStats from '../components/pages/Stats'
import Page from '../components/templates/Page'
import { PageProps } from 'gatsby'

export default function PageGatsbyStats(props: PageProps): ReactElement {
  const content = (props.data as any).content.edges[0].node.childPagesJson
  const { title, description } = content

  return (
    <Page title={title} description={description} uri={props.uri}>
      <PageStats />
    </Page>
  )
}
