import React, { ReactElement, ReactNode } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import styles from './Tabs.module.css'

export interface TabsItem {
  title: string
  content: ReactNode
  disabled?: boolean
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
      <TabList className={styles.tabList}>
        {items.map((item) => (
          <Tab
            className={styles.tab}
            key={item.title}
            onClick={handleTabChange ? () => handleTabChange(item.title) : null}
            disabled={item.disabled}
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
