import React, { ReactElement, useState } from 'react'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'
import { DDO } from '@oceanprotocol/lib'
import styles from './migration.module.css'

export default function StartMigration(): ReactElement {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { accountId } = useWeb3()
  const { did, ddo, metadata, price } = useAsset()
  const { migrationAddress } = useMigrationStatus()
  const { web3 } = useWeb3()

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
    setLoading(true)
    const v4DtName = 'V4 - ' + ddo.dataTokenInfo.name
    const v4DtSymbol = 'V4-' + ddo.dataTokenInfo.symbol

    const migration = new Migration(web3)
    try {
      await migration.startMigration(
        accountId,
        migrationAddress,
        dtV3Address,
        poolV3Address,
        did,
        encryptedFiles,
        ['Ocean Asset NFT', 'OCEAN-NFT'],
        [v4DtName, v4DtSymbol]
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
          }
        >
          <span>Start Migration</span>
        </Button>
      )}
    </>
  )
}
