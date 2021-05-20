import React, { ReactNode, ReactElement } from 'react'
import Permission from '../organisms/Permission'
import PageHeader from '../molecules/PageHeader'
import Seo from '../atoms/Seo'
import Container from '../atoms/Container'

export interface PageProps {
  children: ReactNode
  title: string
  uri: string
  description?: string
  noPageHeader?: boolean
  headerCenter?: boolean
}

export default function Page({
  children,
  title,
  uri,
  description,
  noPageHeader,
  headerCenter
}: PageProps): ReactElement {
  return (
    <Permission eventType="browse">
      <>
        <Seo title={title} description={description} uri={uri} />

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
      </>
    </Permission>
  )
}
