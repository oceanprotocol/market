import React, { ReactNode, ReactElement } from 'react'
import Seo from '../atoms/Seo'
import Container from '../atoms/Container'
import PageHeader from '../molecules/PageHeader'

export interface PageProps {
  children: ReactNode
  title: string
  uri: string
  description?: string
  noPageHeader?: boolean
  headerCenter?: boolean
  narrow?: boolean
}

export default function Page({
  children,
  title,
  uri,
  description,
  noPageHeader,
  headerCenter,
  narrow
}: PageProps): ReactElement {
  return (
    <>
      <Seo title={title} description={description} uri={uri} />

      <Container narrow={narrow}>
        {title && !noPageHeader && (
          <PageHeader
            title={title}
            description={description}
            center={headerCenter}
          />
        )}
        {children}
      </Container>
    </>
  )
}
