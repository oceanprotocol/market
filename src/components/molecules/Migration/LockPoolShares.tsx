import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { OperationResult } from 'urql'
import { PoolLiquidity } from '../../../@types/apollo/PoolLiquidity'
import { useAsset } from '../../../providers/Asset'
import { useMigrationStatus } from '../../../providers/Migration'
import { useWeb3 } from '../../../providers/Web3'
import { fetchData, getQueryContext } from '../../../utils/subgraph'
import Button from '../../atoms/Button'
import Loader from '../../atoms/Loader'
import { userPoolShareQuery } from '../../organisms/AssetActions/Pool'

export default function LockPoolShares(): ReactElement {
  const { accountId } = useWeb3()
  const { ddo, price } = useAsset()
  const [poolTokens, setPoolTokens] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const { approveMigration, addSharesToMigration, refreshMigrationStatus } =
    useMigrationStatus()

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
    return queryResult?.data.pool?.shares[0]?.balance
  }

  useEffect(() => {
    if (!accountId) return
    async function init() {
      try {
        //
        // Get everything the user has put into the pool
        //
        const poolTokens = await getUserPoolShareBalance()
        setPoolTokens(poolTokens)
      } catch (error) {
        Logger.error(error.message)
      }
    }
    init()
  }, [accountId])

  async function addShares(lptV3Amount: string) {
    setLoading(true)
    await approveMigration(lptV3Amount)
    await addSharesToMigration(lptV3Amount)
    await refreshMigrationStatus()
    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <Loader message="Locking pool shares" />
      ) : (
        <Button style="primary" onClick={() => addShares(poolTokens)}>
          <span>Lock Pool Shares</span>
        </Button>
      )}
    </>
  )
}
