import React, { ReactNode, ReactElement } from 'react'
import PageHeader from '../molecules/PageHeader'
import Seo from '../atoms/Seo'
import Container from '../atoms/Container'

export interface PageProps {
  children: ReactNode
  title?: string
  uri: string
  description?: string
  metadescription?: string
  noPageHeader?: boolean
  headerCenter?: boolean
}

export default function Page({
  children,
  title,
  uri,
  description,
  metadescription,
  noPageHeader,
  headerCenter
}: PageProps): ReactElement {
  return (
    <>
      <Seo
        title={title}
        description={description}
        metadescription={metadescription}
        uri={uri}
      />
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
  )
}
