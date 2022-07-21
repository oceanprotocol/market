import React, { ReactElement, ReactNode, useState } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import styles from './index.module.css'
import InputRadio from '@shared/FormInput/InputRadio'

export interface TabsItem {
  title: string
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabsItem[]
  className?: string
  handleTabChange?: (tabName: string) => void
  defaultIndex?: number
  showRadio?: boolean
}

export default function Tabs2({
  items,
  className,
  handleTabChange,
  defaultIndex,
  showRadio
}: TabsProps): ReactElement {
  return (
    <>
      <ReactTabs className={`${className || ''}`} defaultIndex={defaultIndex}>
        <div className={styles.tab2Content}>
          <p>asset signal</p>
          <p>show details</p>
        </div>
      </ReactTabs>
    </>
  )
}
