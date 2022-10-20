import React, { ReactElement } from 'react'
import Link from 'next/link'
import { TabsItem } from '../../slices/tabs'
import TabItem from './item'

type Props = {
  tabs: TabsItem[]
}

const Tabs: React.FC<Props> = ({ tabs }) => {
  return (
    <div className="flex border-b border-gray-500 space-x-8">
      {tabs.map((item) => (
        <TabItem key={item.title} item={item} />
      ))}
    </div>
  )
}

export default Tabs
