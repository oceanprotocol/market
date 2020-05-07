import React, { ReactNode } from 'react'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import styles from './Layout.module.css'
import Header from './components/organisms/Header'
import Footer from './components/organisms/Footer'
import PageHeader from './components/molecules/PageHeader'

export default function Layout({
  children,
  title,
  description,
  noPageHeader
}: {
  children: ReactNode
  title?: string
  description?: string
  noPageHeader?: boolean
}) {
  return (
    <div className={styles.app}>
      <Head>
        <link rel="icon" href="/icons/icon-96x96.png" />
        <link rel="apple-touch-icon" href="icons/icon-256x256.png" />
        <meta name="theme-color" content="#ca2935" />
      </Head>

      <NextSeo title={title} description={description} />

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
