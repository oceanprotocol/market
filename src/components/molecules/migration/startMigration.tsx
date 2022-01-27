import React, { ReactElement } from 'react'
import Container from '../../atoms/Container'
import Alert from '../../atoms/Alert'
import styles from './startMigration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import { useAsset } from '../../../providers/Asset'

function startMigration() {
  console.log('Start Migration Clicked')
}

export default function StartMigration(): ReactElement {
  const { accountId } = useWeb3()
  const { ddo } = useAsset()
  return (
    ddo.proof.creator === accountId && (
      <Container className={styles.container}>
        <Alert
          text="**Time to migrate from V3 to V4** \n\nAs the asset publisher you can initiate the migration from a V3 pool to
        a V4 pool. \n\nThe migration requires 80% of liquidity providers to lock their shares in the migration contract."
          state="info"
          action={{
            name: 'Start Migration',
            handleAction: () => startMigration()
          }}
        />
      </Container>
    )
  )
}
