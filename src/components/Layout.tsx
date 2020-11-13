import React, { ReactNode, ReactElement, useEffect } from 'react'
import Header from './organisms/Header'
import Footer from './organisms/Footer'
import PageHeader from './molecules/PageHeader'
import styles from './Layout.module.css'
import Seo from './atoms/Seo'
import Container from './atoms/Container'
import Alert from './atoms/Alert'
import { useSiteMetadata } from '../hooks/useSiteMetadata'
import { useAsset, useOcean } from '@oceanprotocol/react'
import { Logger } from '@oceanprotocol/lib'

export interface LayoutProps {
  children: ReactNode
  title: string
  uri: string
  description?: string
  noPageHeader?: boolean
  headerCenter?: boolean
}

export default function Layout({
  children,
  title,
  uri,
  description,
  noPageHeader,
  headerCenter
}: LayoutProps): ReactElement {
  const { warning } = useSiteMetadata()
  const { isInPurgatory, purgatoryData } = useAsset()
  const {
    isInPurgatory: isAccountInPurgatory,
    purgatoryData: accountPurgatory
  } = useOcean()

  useEffect(() => {
    Logger.log('isInPurgatory', isInPurgatory, purgatoryData)
  }, [isInPurgatory, purgatoryData])

  return (
    <div className={styles.app}>
      <Seo title={title} description={description} uri={uri} />

      <Header />

      {uri === '/' && (
        <Alert text={warning} state="info" className={styles.banner} />
      )}

      {isAccountInPurgatory && accountPurgatory && (
        <Alert
          title="Account In Purgatory"
          badge={accountPurgatory.reason}
          text="No further actions are permitted by this account. For more details go to [list-purgatory](https://github.com/oceanprotocol/list-purgatory)."
          state="error"
        />
      )}

      {isInPurgatory && purgatoryData && (
        <Alert
          title="Data Set In Purgatory"
          badge={purgatoryData.reason}
          text="Except for removing liquidity, no further actions are permitted on this data set and it will not be returned in any search. For more details go to [list-purgatory](https://github.com/oceanprotocol/list-purgatory)."
          state="error"
        />
      )}

      <main className={styles.main}>
        <Container>
          {title && !noPageHeader && (
            <PageHeader
              title={title}
              description={description}
              center={headerCenter}
            />
          )}
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
