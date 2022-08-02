import React, { ReactNode, ReactElement } from 'react'
import PageHeader from './PageHeader'
import Seo from './Seo'
import Container from '@shared/atoms/Container'

export interface PageProps {
  children: ReactNode
  title?: string
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
    <>
      <Seo title={title} description={description} uri={uri} />
      <Container>
        {title && !noPageHeader && (
          <PageHeader
            title={<>{title.slice(0, 400)}</>}
            description={description}
            center={headerCenter}
          />
        )}
        {children}
      </Container>
    </>
  )
}
