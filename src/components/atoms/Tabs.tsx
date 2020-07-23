import React, { ReactElement, ReactNode } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import styles from './Tabs.module.css'
import shortid from 'shortid'

interface TabsItem {
  title: string
  content: ReactNode
}

export default function Tabs({
  items,
  className
}: {
  items: TabsItem[]
  className?: string
}): ReactElement {
  return (
    <ReactTabs className={`${className && className}`}>
      <TabList className={styles.tabList}>
        {items.map((item) => (
          <Tab className={styles.tab} key={shortid.generate()}>
            {item.title}
          </Tab>
        ))}
      </TabList>
      <div className={styles.tabContent}>
        {items.map((item) => (
          <TabPanel key={shortid.generate()}>{item.content}</TabPanel>
        ))}
      </div>
    </ReactTabs>
  )
}
