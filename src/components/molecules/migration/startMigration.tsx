import React, { ReactElement } from 'react'
import Container from '../../atoms/Container'
import Alert from '../../atoms/Alert'
import styles from './startMigration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'
import { DDO, MetadataMain } from '@oceanprotocol/lib'

async function startMigration(
  web3: Web3,
  accountId: string,
  migrationAddress: string,
  did: string,
  ddo: DDO,
  encryptedFiles: string,
  dtV3Address: string,
  poolV3Address: string
) {
  console.log('Start Migration Clicked')
  console.log('Price', ddo.price)

  const migration = new Migration(web3)
  await migration.startMigration(
    accountId,
    migrationAddress,
    dtV3Address,
    poolV3Address,
    did,
    encryptedFiles,
    ['NFTname', 'NFTsymbol'],
    [ddo.dataTokenInfo.name, ddo.dataTokenInfo.symbol]
  )
}

export default function StartMigration(): ReactElement {
  const { accountId } = useWeb3()
  const { owner, did, ddo, metadata, price } = useAsset()
  const { status, migrationAddress } = useMigrationStatus()
  const { web3 } = useWeb3()
  return (
    owner === accountId &&
    status === '0' && (
      <Container className={styles.container}>
        <Alert
          text="**Time to migrate from V3 to V4** \n\nAs the asset publisher you can initiate the migration from a V3 pool to
        a V4 pool. \n\nThe migration requires 80% of liquidity providers to lock their shares in the migration contract."
          state="info"
          action={{
            name: 'Start Migration',
            handleAction: () =>
              startMigration(
                web3,
                accountId,
                migrationAddress,
                did,
                ddo,
                metadata.encryptedFiles,
                ddo.dataToken,
                price.address
              )
          }}
        />
      </Container>
    )
  )
}
