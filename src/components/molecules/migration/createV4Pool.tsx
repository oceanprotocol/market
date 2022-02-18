import React, { ReactElement, useState } from 'react'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'
import styles from './migration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'

export default function CreateV4Pool(): ReactElement {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { accountId } = useWeb3()
  const { price } = useAsset()
  const { migrationAddress } = useMigrationStatus()
  const { web3 } = useWeb3()

  async function liquidateAndCreatePool(
    web3: Web3,
    accountId: string,
    migrationAddress: string,
    poolV3Address: string
  ) {
    const migration = new Migration(web3)

    try {
      await migration.liquidateAndCreatePool(
        accountId,
        migrationAddress,
        poolV3Address,
        ['1', '1']
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
            liquidateAndCreatePool(
              web3,
              accountId,
              migrationAddress,
              price.address
            )
          }
        >
          <span>Complete Migration</span>
        </Button>
      )}
    </>
  )
}
