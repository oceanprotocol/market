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
    console.log('isInPurgatory', isInPurgatory, purgatoryData)
  }, [isInPurgatory])
  return (
    <div className={styles.app}>
      <Seo title={title} description={description} uri={uri} />

      <Header />

      {uri === '/' && (
        <Alert text={warning} state="info" className={styles.banner} />
      )}

      {isAccountInPurgatory && accountPurgatory && (
        <Alert
          className={styles.warning}
          text={`Account in purgatory - No further actions permitted! Reason: ${accountPurgatory.reason}. For more details go [here](https://github.com/oceanprotocol/list-purgatory) `}
          state="error"
        />
      )}

      {isInPurgatory && purgatoryData && (
        <Alert
          className={styles.warning}
          text={`Asset in purgatory - No further actions permitted! Reason: ${purgatoryData.reason}. For more details go [here](https://github.com/oceanprotocol/list-purgatory) `}
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
