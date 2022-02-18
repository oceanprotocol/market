import React, { ReactElement } from 'react'
import Button from '../../atoms/Button'
import styles from './migration.module.css'
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
  await migration.liquidateAndCreatePool(
    accountId,
    migrationAddress,
    poolV3Address,
    ['1', '1']
  )
}

export default function CreateV4Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { price } = useAsset()
  const { migrationAddress } = useMigrationStatus()
  const { web3 } = useWeb3()

  return (
    <Button
      style="primary"
      className={styles.button}
      onClick={() =>
        liquidateAndCreatePool(web3, accountId, migrationAddress, price.address)
      }
    >
      <span>Complete Migration</span>
    </Button>
  )
}
