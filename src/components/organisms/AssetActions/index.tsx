import React, { ReactElement } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { MetadataMarket } from '../../../@types/Metadata'
import { MetadataStore, Logger, DDO } from '@oceanprotocol/lib'

export default function AssetActions({
  metadata,
  ddo
}: {
  metadata: MetadataMarket
  ddo: DDO
}): ReactElement {
  const { access } = metadata.additionalInformation
  const isCompute = access && access === 'Compute'

  return (
    <Tabs className={styles.actions}>
      <TabList className={styles.tabList}>
        <Tab className={styles.tab}>Use</Tab>
        <Tab className={styles.tab}>Trade</Tab>
      </TabList>
      <div className={styles.tabContent}>
        <TabPanel>
          {isCompute ? (
            <Compute ddo={ddo} />
          ) : (
            <Consume ddo={ddo} file={metadata.main.files[0]} />
          )}
        </TabPanel>
        <TabPanel>Trade Me</TabPanel>
      </div>
    </Tabs>
  )
}
