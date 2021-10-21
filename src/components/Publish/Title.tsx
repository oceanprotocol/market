import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import { useWeb3 } from '@context/Web3'
import styles from './Title.module.css'

import { graphql, useStaticQuery } from 'gatsby'

const query = graphql`
  query {
    content: allFile(filter: { relativePath: { eq: "publish/index.json" } }) {
      edges {
        node {
          childPublishJson {
            title
            tooltipNetwork
          }
        }
      }
    }
  }
`

export default function Title(): ReactElement {
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childPublishJson
  const { networkId } = useWeb3()

  return (
    <>
      {content.title}{' '}
      {networkId && (
        <>
          into <NetworkName networkId={networkId} className={styles.network} />
          <Tooltip
            content={content.tooltipNetwork}
            className={styles.tooltip}
          />
        </>
      )}
    </>
  )
}
