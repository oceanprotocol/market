import React, { ReactElement } from 'react'
import styles from './migration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'
import Button from '../../atoms/Button'

async function removeShares(
  web3: Web3,
  accountId: string,
  migrationAddress: string,
  poolV3Address: string,
  lptV3Amount: string
) {
  const migration = new Migration(web3)
  await migration.removeShares(
    accountId,
    migrationAddress,
    poolV3Address,
    web3.utils.toWei(lptV3Amount)
  )
}

export default function UnlockPoolShares(): ReactElement {
  const { accountId } = useWeb3()
  const { migrationAddress, poolV3Address, poolShares } = useMigrationStatus()
  const { web3 } = useWeb3()

  return (
    <Button
      style="primary"
      className={styles.button}
      onClick={() =>
        removeShares(
          web3,
          accountId,
          migrationAddress,
          poolV3Address,
          poolShares
        )
      }
    >
      <span>Unlock Pool Shares</span>
    </Button>
  )
}
