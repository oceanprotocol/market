import React, { ReactNode, ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import Header from './organisms/Header'
import Footer from './organisms/Footer'
import PageHeader from './molecules/PageHeader'
import styles from './Layout.module.css'
import Seo from './atoms/Seo'
import Container from './atoms/Container'

export interface LayoutProps {
  children: ReactNode
  title: string
  uri: string
  description?: string
  noPageHeader?: boolean
}

export default function Layout({
  children,
  title,
  uri,
  description,
  noPageHeader
}: LayoutProps): ReactElement {
  return (
    <div className={styles.app}>
      <Helmet>
        <link rel="icon" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" href="icons/icon-256x256.png" />
        <meta name="theme-color" content="#ca2935" />
      </Helmet>

      <Seo title={title} description={description} uri={uri} />

      <Header />
      <main className={styles.main}>
        <Container>
          {title && !noPageHeader && (
            <PageHeader title={title} description={description} />
          )}
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  )
}
