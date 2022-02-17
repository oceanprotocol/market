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

async function liquidateAndCreatePool(
  web3: Web3,
  accountId: string,
  migrationAddress: string,
  did: string,
  ddo: DDO,
  encryptedFiles: string,
  dtV3Address: string,
  poolV3Address: string
) {
  const migration = new Migration(web3)
  await migration.liquidateAndCreatePool(
    accountId,
    migrationAddress,
    poolV3Address,
    ['1', '1']
  )
}

export default function CreateV4Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { owner, did, ddo, metadata, price } = useAsset()
  const { status, migrationAddress, thresholdMet } = useMigrationStatus()
  const { web3 } = useWeb3()
  console.log('Start Migration status', status)
  console.log('Start Migration thresholdMet', thresholdMet)
  return (
    <>
      {owner === accountId && status === '0' && (
        <Container className={styles.container}>
          <Alert
            title="V4 Pool can now be created"
            text="**The V3 pool will be liquidated** \n\nOver 80% of pool shares have now been locked and the threshold has therefore been reached for completing the migration.
            \n\nThe deadline for locking pool shares has now passed so no additional pool shares can be locked."
            state="info"
            action={{
              name: 'Complete Migration',
              handleAction: () =>
                liquidateAndCreatePool(
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
      )}
      {owner === accountId && status !== '0' && thresholdMet !== true && (
        <Container className={styles.container}>
          <Alert
            title="Migration in progress"
            text="**The threshold of 80% of pool shares locked has not been reached yet**  \n\nThe migration requires 80% of liquidity providers to lock their shares in the migration contract."
            state="info"
          />
        </Container>
      )}
    </>
  )
}
