import { Field, useFormikContext } from 'formik'
import React, { ReactElement, ReactNode, useState } from 'react'
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs'
import styles from './index.module.css'
import InputRadio from '@shared/FormInput/InputRadio'
import contentAsset from '../../../../../content/settings/assets.json'

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
  const items2 = Object.entries(contentAsset).map(([key, value], index) => (
    <>
      <>
        <li key={index}>
          <h3>{value.name}</h3>
        </li>
      </>
    </>
  ))
  return (
    <>
      <ReactTabs className={`${className || ''}`} defaultIndex={defaultIndex}>
        <div className={styles.tab2Content}>
          <div className={styles.tab2Content}>
            <p>asset signal</p>
            <p>show details</p>
          </div>
          <div>
            {' '}
            <ol className={styles.assets}>{items2}</ol>
          </div>
        </div>
      </ReactTabs>
    </>
  )
}
