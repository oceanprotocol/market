import React, { ReactElement, useState } from 'react'
import stylesActions from './Actions/index.module.css'
import Button from '@shared/atoms/Button'
import Add from './Add'
import Remove from './Remove'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import PoolTransactions from '@shared/PoolTransactions'

import { usePool } from '@context/Pool'
import PoolSections from './Sections'

export default function Pool(): ReactElement {
  const { isInPurgatory, asset, isAssetNetwork } = useAsset()
  const { hasUserAddedLiquidity } = usePool()
  const { accountId } = useWeb3()

  const [showAdd, setShowAdd] = useState(false)
  const [showRemove, setShowRemove] = useState(false)

  return (
    <>
      {showAdd ? (
        <Add setShowAdd={setShowAdd} />
      ) : showRemove ? (
        <Remove setShowRemove={setShowRemove} />
      ) : (
        <>
          <PoolSections />

          <div className={stylesActions.actions}>
            <Button
              style="primary"
              size="small"
              onClick={() => setShowAdd(true)}
              disabled={isInPurgatory || !isAssetNetwork}
            >
              Add Liquidity
            </Button>

            {hasUserAddedLiquidity && (
              <Button
                size="small"
                onClick={() => setShowRemove(true)}
                disabled={!isAssetNetwork}
              >
                Remove
              </Button>
            )}
          </div>
          {accountId && (
            <AssetActionHistoryTable title="Your Pool Transactions">
              <PoolTransactions
                accountId={accountId}
                poolAddress={asset?.accessDetails?.addressOrId}
                poolChainId={asset?.chainId}
                minimal
              />
            </AssetActionHistoryTable>
          )}
        </>
      )}
    </>
  )
}
