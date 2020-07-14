import React, { ReactElement } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import styles from './index.module.css'
import Compute from './Compute'
import Consume from './Consume'
import { useOcean } from '@oceanprotocol/react'
import { MetaDataMarket } from '../../../@types/MetaData'

export default function AssetActions({
  metadata,
  did
}: {
  metadata: MetaDataMarket
  did: string
}): ReactElement {
  // const { ocean, balanceInOcean } = useOcean()
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
            // <Compute
            //   did={did}
            //   metadata={metadata}
            //   ocean={ocean}
            //   balance={balanceInOcean}
            // />
            'Compute Me'
          ) : (
            <Consume did={did} metadata={metadata} />
          )}
        </TabPanel>
        <TabPanel>Trade Me</TabPanel>
      </div>
    </Tabs>
  )
}
