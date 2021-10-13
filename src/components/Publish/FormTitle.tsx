import React, { ReactElement } from 'react'
import NetworkName from '@shared/atoms/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import { useWeb3 } from '@context/Web3'
import styles from './FormTitle.module.css'

import { graphql, useStaticQuery } from 'gatsby'

const query = graphql`
  query {
    content: allFile(
      filter: { relativePath: { eq: "pages/publish/index.json" } }
    ) {
      edges {
        node {
          childPublishJson {
            tooltipNetwork
          }
        }
      }
    }
  }
`

export default function FormTitle({ title }: { title: string }): ReactElement {
  const data = useStaticQuery(query)
  const contentTooltip =
    data.content.edges[0].node.childPublishJson.tooltipNetwork
  const { networkId } = useWeb3()

  return (
    <h2 className={styles.title}>
      {title}{' '}
      {networkId && (
        <>
          into <NetworkName networkId={networkId} className={styles.network} />
          <Tooltip content={contentTooltip} className={styles.tooltip} />
        </>
      )}
    </h2>
  )
}
