import React, { ReactNode, ReactElement, useMemo } from 'react'
import PageHeader from './PageHeader'
import Seo from './Seo'
import Tabs from '../../Tabs'
import Categories from '../../Categories'
import { useAppSelector } from '../../../store'

export interface PageProps {
  children: ReactNode
  title?: string
  uri: string
  description?: string
  noPageHeader?: boolean
  noTabs?: boolean
  noCategories?: boolean
}

export default function Page({
  children,
  title,
  uri,
  description,
  noPageHeader,
  noCategories,
  noTabs
}: PageProps): ReactElement {
  const tabs = useAppSelector((state) => state.tabs[title.toLowerCase()])
  const categories = useAppSelector(
    (state) => state.categories[title.toLowerCase()]
  )

  return (
    <>
      <Seo title={title} description={description} uri={uri} />
      <div className="h-screen bg-gray-900 h-full pl-6 overflow-hidden">
        {!noPageHeader && (
          <PageHeader title={title} description={description} />
        )}
        {tabs && !noTabs && <Tabs tabs={tabs} />}
        <div className="h-full flex flex-row overflow-hidden">
          {categories && !noCategories && (
            <Categories categories={categories} />
          )}
          <main className="overflow-y-auto w-full">{children}</main>
        </div>
      </div>
    </>
  )
}
