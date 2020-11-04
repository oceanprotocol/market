import React, { ReactNode, ReactElement } from 'react'
import Header from './organisms/Header'
import Footer from './organisms/Footer'
import PageHeader from './molecules/PageHeader'
import styles from './Layout.module.css'
import Seo from './atoms/Seo'
import Container from './atoms/Container'
import Alert from './atoms/Alert'
import { useSiteMetadata } from '../hooks/useSiteMetadata'

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

  return (
    <div className={styles.app}>
      <Seo title={title} description={description} uri={uri} />

      <Header />

      {uri === '/' && (
        <Alert text={warning} state="info" className={styles.banner} />
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
