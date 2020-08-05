import React, { ReactElement, ReactNode } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import styles from './Tabs.module.css'

interface TabsItem {
  title: string
  content: ReactNode
}

export default function Tabs({
  items,
  className,
  handleTabChange
}: {
  items: TabsItem[]
  className?: string
  handleTabChange?: (tabName: string) => void
}): ReactElement {
  return (
    <ReactTabs className={`${className && className}`}>
      <TabList className={styles.tabList}>
        {items.map((item) => (
          <Tab
            className={styles.tab}
            key={item.title}
            onClick={() => handleTabChange(item.title)}
          >
            {item.title}
          </Tab>
        ))}
      </TabList>
      <div className={styles.tabContent}>
        {items.map((item) => (
          <TabPanel key={item.title}>{item.content}</TabPanel>
        ))}
      </div>
    </ReactTabs>
  )
}
