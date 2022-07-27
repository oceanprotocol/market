import React, { ReactElement, useState } from 'react'
import stylesActions from './Actions/index.module.css'
import Button from '@shared/atoms/Button'
import Remove from './Remove'
import AssetActionHistoryTable from '../AssetActionHistoryTable'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import PoolTransactions from '@shared/PoolTransactions'

import { usePool } from '@context/Pool'
import PoolSections from './Sections'

export default function Pool(): ReactElement {
  const { asset, isAssetNetwork } = useAsset()
  const { hasUserAddedLiquidity } = usePool()
  const { accountId } = useWeb3()

  const [showRemove, setShowRemove] = useState(false)

  return (
    <>
      {showRemove ? (
        <Remove setShowRemove={setShowRemove} />
      ) : (
        <>
          <PoolSections />

          {hasUserAddedLiquidity && (
            <div className={stylesActions.actions}>
              <Button
                style="primary"
                size="small"
                onClick={() => setShowRemove(true)}
                disabled={!isAssetNetwork}
              >
                Remove Liquidity
              </Button>
            </div>
          )}

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
