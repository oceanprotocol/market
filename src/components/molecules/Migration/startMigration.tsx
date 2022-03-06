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
import Button from '../../atoms/Button'

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
  const v4DtName = 'V4 - ' + ddo.dataTokenInfo.name
  const v4DtSymbol = 'V4-' + ddo.dataTokenInfo.symbol

  const migration = new Migration(web3)

  await migration.startMigration(
    accountId,
    migrationAddress,
    dtV3Address,
    poolV3Address,
    did,
    encryptedFiles, // TODO this seems wrong, it's the tokenUri see tokenUri in ocean.js v4
    ['Ocean Asset NFT', 'OCEAN-NFT'],
    [v4DtName, v4DtSymbol]
  )
}

export default function StartMigration(): ReactElement {
  const { accountId } = useWeb3()
  const { did, ddo, metadata, price } = useAsset()
  const { migrationAddress } = useMigrationStatus()
  const { web3 } = useWeb3()

  return (
    <Button
      style="primary"
      className={styles.button}
      // eslint-disable-next-line security/detect-non-literal-fs-filename
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
  )
}
