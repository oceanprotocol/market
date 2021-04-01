import React, { ReactElement } from 'react'
import Footer from './organisms/Footer'
import Header from './organisms/Header'
import Styles from '../global/Styles'
import styles from './App.module.css'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import Alert from './atoms/Alert'
import { graphql, PageProps, useStaticQuery } from 'gatsby'
import { useAccountPurgatory } from '../hooks/useAccountPurgatory'
import AnnouncementBanner from './molecules/AnnouncementBanner'
import { useWeb3 } from '../providers/Web3'

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

  return (
    <Styles>
      <div className={styles.app}>
        {!location.pathname.includes('/asset/did') && <AnnouncementBanner />}
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
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </Styles>
  )
}
