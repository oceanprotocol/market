import React, { ReactNode, ReactElement } from 'react'
import { Helmet } from 'react-helmet'
import Header from './organisms/Header'
import Footer from './organisms/Footer'
import PageHeader from './molecules/PageHeader'
import styles from './Layout.module.css'
import Seo from './atoms/Seo'

export interface LayoutProps {
  children: ReactNode
  title?: string
  description?: string
  noPageHeader?: boolean
  location?: Location
}

export default function Layout({
  children,
  title,
  description,
  noPageHeader,
  location
}: LayoutProps): ReactElement {
  return (
    <div className={styles.app}>
      <Helmet>
        <link rel="icon" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" href="icons/icon-256x256.png" />
        <meta name="theme-color" content="#ca2935" />
      </Helmet>

      <Seo
        title={title}
        description={description}
        uri={location.href}
        location={location}
      />

      <Header />
      <main className={styles.main}>
        {title && !noPageHeader && (
          <PageHeader title={title} description={description} />
        )}
        {children}
      </main>
      <Footer />
    </div>
  )
}
