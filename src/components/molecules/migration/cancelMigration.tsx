import React, { ReactElement } from 'react'
import Container from '../../atoms/Container'
import Alert from '../../atoms/Alert'
import styles from './startMigration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'

async function liquidateAndCreatePool(
  web3: Web3,
  accountId: string,
  migrationAddress: string,
  poolV3Address: string
) {
  const migration = new Migration(web3)
  await migration.cancelMigration(accountId, migrationAddress, poolV3Address)
}

export default function CreateV4Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { owner, price } = useAsset()
  const { status, migrationAddress, thresholdMet, deadlinePassed } =
    useMigrationStatus()
  const { web3 } = useWeb3()
  console.log('Start Migration status', status)
  console.log('Start Migration thresholdMet', thresholdMet)

  return (
    <>
      {owner === accountId &&
        status === '1' &&
        !thresholdMet &&
        deadlinePassed && (
          <Container className={styles.container}>
            <Alert
              title="V4 Migration can be canceled"
              text="**The V3 pool will be remain** \n\Less than 80% of pool shares have now locked and the threshold has not been reached for completing the migration.
            \n\nThe deadline for locking pool shares has now passed so no additional pool shares can be locked."
              state="info"
              action={{
                name: 'Cancel Migration',
                handleAction: () =>
                  liquidateAndCreatePool(
                    web3,
                    accountId,
                    migrationAddress,
                    price.address
                  )
              }}
            />
          </Container>
        )}
    </>
  )
}
