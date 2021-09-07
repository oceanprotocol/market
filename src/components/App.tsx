import React, { ReactElement } from 'react'
import { graphql, PageProps, useStaticQuery } from 'gatsby'
import Alert from './atoms/Alert'
import Footer from './organisms/Footer'
import Header from './organisms/Header'
import Styles from '../global/Styles'
import { useWeb3 } from '../providers/Web3'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { useAccountPurgatory } from '../hooks/useAccountPurgatory'
import AnnouncementBanner from './atoms/AnnouncementBanner'
import styles from './App.module.css'
import PrivacyPreferenceCenter from './organisms/PrivacyPreferenceCenter'

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

  const { warning, appConfig } = useSiteMetadata()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)

  return (
    <Styles>
      <div className={styles.app}>
        {(props as PageProps).uri === '/' && (
          <AnnouncementBanner text={warning.main} />
        )}
        <Header />

        {isInPurgatory && (
          <Alert
            title={purgatory.title}
            badge={`Reason: ${purgatoryData?.reason}`}
            text={purgatory.description}
            state="error"
          />
        )}
        <main className={styles.main}>{children}</main>
        <Footer />

        {appConfig.privacyPreferenceCenter === 'true' && (
          <PrivacyPreferenceCenter style="default" />
        )}
      </div>
    </Styles>
  )
}
