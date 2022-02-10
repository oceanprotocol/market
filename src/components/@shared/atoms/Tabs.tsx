import React, { ReactElement, ReactNode } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import InputElement from '@shared/FormInput/InputElement'
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
  defaultIndex,
  showRadio
}: {
  items: TabsItem[]
  className?: string
  handleTabChange?: (tabName: string) => void
  defaultIndex?: number
  showRadio?: boolean
}): ReactElement {
  return (
    <ReactTabs
      className={`${className && className}`}
      defaultIndex={defaultIndex}
    >
      <TabList className={styles.tabList}>
        {items.map((item, index) => (
          <Tab
            className={styles.tab}
            key={item.title}
            onClick={handleTabChange ? () => handleTabChange(item.title) : null}
            disabled={item.disabled}
          >
            {showRadio ? (
              <InputElement
                name={item.title}
                type="radio"
                checked={defaultIndex === index}
                options={[item.title]}
                readOnly
              />
            ) : (
              item.title
            )}
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
