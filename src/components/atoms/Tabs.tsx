import React, { ReactElement, ReactNode } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import { tabList, tab, tabContent } from './Tabs.module.css'

interface TabsItem {
  title: string
  content: ReactNode
}

export default function Tabs({
  items,
  className,
  handleTabChange,
  defaultIndex
}: {
  items: TabsItem[]
  className?: string
  handleTabChange?: (tabName: string) => void
  defaultIndex?: number
}): ReactElement {
  return (
    <ReactTabs
      className={`${className && className}`}
      defaultIndex={defaultIndex}
    >
      <TabList className={tabList}>
        {items.map((item) => (
          <Tab
            className={tab}
            key={item.title}
            onClick={handleTabChange ? () => handleTabChange(item.title) : null}
          >
            {item.title}
          </Tab>
        ))}
      </TabList>
      <div className={tabContent}>
        {items.map((item) => (
          <TabPanel key={item.title}>{item.content}</TabPanel>
        ))}
      </div>
    </ReactTabs>
  )
}
