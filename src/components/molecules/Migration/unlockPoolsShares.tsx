import React, { ReactElement, useState } from 'react'
import styles from './migration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'

export default function UnlockPoolShares(): ReactElement {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { accountId } = useWeb3()
  const { migrationAddress, poolV3Address, poolShares } = useMigrationStatus()
  const { web3 } = useWeb3()

  async function removeShares(
    web3: Web3,
    accountId: string,
    migrationAddress: string,
    poolV3Address: string,
    lptV3Amount: string
  ) {
    const migration = new Migration(web3)
    try {
      await migration.removeShares(
        accountId,
        migrationAddress,
        poolV3Address,
        web3.utils.toWei(lptV3Amount)
      )
    } catch (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSuccess(true)
    setLoading(false)
  }
  return (
    <>
      {loading && <Loader />}
      {success && <span className={styles.success}>Migration Started</span>}
      {error !== '' && <span className={styles.success}>{error}</span>}
      {!loading && !success && !error && (
        <Button
          style="primary"
          className={styles.button}
          onClick={() =>
            removeShares(
              web3,
              accountId,
              migrationAddress,
              poolV3Address,
              poolShares.toString()
            )
          }
        >
          <span>Unlock Pool Shares</span>
        </Button>
      )}
    </>
  )
}
