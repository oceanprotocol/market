import React, { ReactElement } from 'react'
import { graphql, PageProps, useStaticQuery } from 'gatsby'
import Styles from '../global/Styles'
import Alert from './atoms/Alert'
import AnnouncementBanner from './atoms/AnnouncementBanner'
import NetworkBanner from './molecules/NetworkBanner'
import Footer from './organisms/Footer'
import Header from './organisms/Header'
import { useWeb3 } from '../providers/Web3'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { useAccountPurgatory } from '../hooks/useAccountPurgatory'
import { useGraphSyncStatus } from '../hooks/useGraphSyncStatus'
import { app, main } from './App.module.css'

const contentQuery = graphql`
  query AppQuery {
    purgatory: allFile(filter: { relativePath: { eq: "purgatory.json" } }) {
      edges {
        node {
          childContentJson {
            account {
              title
              description
            }
          }
        }
      }
    }
  }
`

export default function App({
  children,
  ...props
}: {
  children: ReactElement
}): ReactElement {
  const data = useStaticQuery(contentQuery)
  const purgatory = data.purgatory.edges[0].node.childContentJson.account

  const { warning } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)
  const { isGraphSynced, blockHead, blockGraph } = useGraphSyncStatus()

  return (
    <Styles>
      <div className={app}>
        {!isGraphSynced && (
          <AnnouncementBanner
            text={`The data for this network has only synced to Ethereum block ${blockGraph} (out of ${blockHead}). Please check back soon.`}
            state="error"
          />
        )}
        {!location.pathname.includes('/asset/did') && <NetworkBanner />}

        <Header />

        {(props as PageProps).uri === '/' && (
          <Alert text={warning.main} state="info" />
        )}

        {isInPurgatory && (
          <Alert
            title={purgatory.title}
            badge={`Reason: ${purgatoryData?.reason}`}
            text={purgatory.description}
            state="error"
          />
        )}
        <main className={main}>{children}</main>
        <Footer />
      </div>
    </Styles>
  )
}
