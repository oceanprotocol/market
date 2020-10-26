import React, { ReactNode, ReactElement } from 'react'
import Header from './organisms/Header'
import Footer from './organisms/Footer'
import PageHeader from './molecules/PageHeader'
import styles from './Layout.module.css'
import Seo from './atoms/Seo'
import Container from './atoms/Container'
import Alert from './atoms/Alert'

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
  return (
    <div className={styles.app}>
      <Seo title={title} description={description} uri={uri} />

      <Header />

      <Alert
        text="Given the beta status, publishing on Rinkeby first is strongly recommended. [Learn about the market](https://blog.oceanprotocol.com)."
        state="info"
      />

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
