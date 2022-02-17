import React, { ReactElement, useState, useEffect } from 'react'
import Container from '../../atoms/Container'
import Alert from '../../atoms/Alert'
import styles from './startMigration.module.css'
import { useWeb3 } from '../../../providers/Web3'
import Web3 from 'web3'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import { Migration } from 'v4-migration-lib'
import { Logger } from '@oceanprotocol/lib'
import { gql, OperationResult } from 'urql'
import { fetchData, getQueryContext } from '../../../utils/subgraph'
import { PoolLiquidity } from '../../../@types/apollo/PoolLiquidity'
console.log('useMigrationStatus', useMigrationStatus)
console.log('useAsset', useAsset)

const userPoolShareQuery = gql`
  query poolShare($id: ID!, $shareId: ID) {
    pool(id: $id) {
      id
      shares(where: { id: $shareId }) {
        id
        balance
      }
    }
  }
`

async function addShares(
  web3: Web3,
  accountId: string,
  migrationAddress: string,
  poolV3Address: string,
  lptV3Amount: string
) {
  console.log('add shares', {
    accountId,
    migrationAddress,
    poolV3Address,
    lptV3Amount
  })
  const migration = new Migration(web3)
  const { userV3Shares } = await migration.getShareAllocation(
    migrationAddress,
    poolV3Address,
    accountId
  )
  console.log('userV3Shares', userV3Shares)
  await migration.approve(
    accountId,
    poolV3Address,
    migrationAddress,
    web3.utils.toWei('1')
  )
  await migration.addShares(
    accountId,
    migrationAddress,
    poolV3Address,
    web3.utils.toWei('1')
  )
}

export default function LockPoolShares(): ReactElement {
  const { accountId } = useWeb3()
  const { owner, ddo, price } = useAsset()
  const [poolTokens, setPoolTokens] = useState<string>()
  const [currentBlock, setCurrentBlock] = useState<number>()

  const { status, migrationAddress, poolV3Address, deadline } =
    useMigrationStatus()
  // console.log('[LockPoolShares] status', status)
  // console.log('[LockPoolShares] migrationAddress', migrationAddress)
  const { web3 } = useWeb3()
  console.log('Missing values?', owner, ddo, price)
  if (!owner || !ddo || !price) {
    console.log('Missing values: ', owner, ddo, price)
  }

  async function getUserPoolShareBalance() {
    const queryContext = getQueryContext(ddo.chainId)
    const queryVariables = {
      id: price.address.toLowerCase(),
      shareId: `${price.address.toLowerCase()}-${accountId.toLowerCase()}`
    }

    const queryResult: OperationResult<PoolLiquidity> = await fetchData(
      userPoolShareQuery,
      queryVariables,
      queryContext
    )
    return queryResult?.data.pool.shares[0]?.balance
  }

  useEffect(() => {
    if (!accountId) return
    async function init() {
      try {
        //
        // Get everything the user has put into the pool
        //
        const poolTokens = await getUserPoolShareBalance()
        console.log('getUserPoolShareBalance', poolTokens)
        setPoolTokens(poolTokens)

        const currentBlock = await web3.eth.getBlockNumber()
        setCurrentBlock(currentBlock)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    init()
  }, [accountId])
  console.log('currentBlock > deadline', currentBlock, deadline)
  return (
    <>
      {currentBlock > parseInt(deadline) &&
        owner !== accountId &&
        status !== '0' &&
        poolTokens !== '0' &&
        poolTokens !== undefined && (
          <Container className={styles.container}>
            <Alert
              title="Migration Deadline Passed"
              text={`**You can no longer lock pool shares** 
          \n\nThe 1 month period for locking your pool shares has now elapsed and you can no longer lock your pool shares in the migration contract.
          `}
              state="warning"
            />
          </Container>
        )}
      {owner !== accountId &&
        status !== '0' &&
        poolTokens !== '0' &&
        poolTokens !== undefined && (
          <Container className={styles.container}>
            <Alert
              text={`**The publisher of this data asset has initiated the migration of this pool from V3 to V4** 
          \n\nYou can now lock your liquidity pool tokens in the smart contract to ensure you will receive tokens from the new V4 pool when it is created.
          \n\nThe migration requires 80% of liquidity providers to lock their shares in the migration contract.
          \n\nYou currently have ${poolTokens} Pool Shares`}
              state="info"
              action={{
                name: `Lock Pool Shares`,
                handleAction: () =>
                  addShares(
                    web3,
                    accountId,
                    migrationAddress,
                    poolV3Address,
                    poolTokens
                  )
              }}
            />
          </Container>
        )}
    </>
  )
}
