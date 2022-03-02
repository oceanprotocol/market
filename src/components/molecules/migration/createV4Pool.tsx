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
  poolV3Address: string
) {
  const migration = new Migration(web3)

  await migration.runMigration(accountId, migrationAddress, poolV3Address, [
    '1',
    '1'
  ])
}

function openMarketV4(
  did: string,
  marketV4Url = 'https://market-git-v4-oceanprotocol.vercel.app/'
) {
  window.open(`${marketV4Url}/asset/${did}`, '_blank')
}

export default function CreateV4Pool(): ReactElement {
  const { accountId } = useWeb3()
  const { owner, price, ddo } = useAsset()
  const { status, migrationAddress, thresholdMet, deadlinePassed, didV4 } =
    useMigrationStatus()
  const { web3 } = useWeb3()

  return (
    <>
      {owner === accountId && status === '1' && thresholdMet && deadlinePassed && (
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
                  price.address
                )
            }}
          />
        </Container>
      )}
      {status === '3' && (
        <Container className={styles.container}>
          <Alert
            title="This asset has been migrated to Ocean V4"
            text="Head over to our new V4 market to view and interact with this asset."
            state="info"
            action={{
              name: 'Market v4',
              handleAction: () => openMarketV4(didV4)
            }}
          />
        </Container>
      )}
    </>
  )
}
