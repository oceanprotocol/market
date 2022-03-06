import React, { ReactElement } from 'react'
import Container from '../../atoms/Container'
import Alert from '../../atoms/Alert'
import styles from './startMigration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'
import Button from '../../atoms/Button'

async function liquidateAndCreatePool(
  web3: Web3,
  accountId: string,
  migrationAddress: string,
  poolV3Address: string
) {
  const migration = new Migration(web3)

  await migration.runMigration(accountId, migrationAddress, poolV3Address, [
    '1',
    '1'
  ])
}

export default function CreateV4Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { owner, price, ddo } = useAsset()
  const {
    status,
    migrationAddress,
    thresholdMet,
    deadlinePassed,
    didV4,
    migrationTokenDetails
  } = useMigrationStatus()
  const { web3 } = useWeb3()

  return (
    <Button
      style="primary"
      className={styles.button}
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      onClick={() =>
        liquidateAndCreatePool(web3, accountId, migrationAddress, price.address)
      }
    >
      <span>Complete Migration</span>
    </Button>
  )
}
