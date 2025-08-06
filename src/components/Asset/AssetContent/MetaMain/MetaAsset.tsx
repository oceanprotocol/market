import { useAsset } from '@context/Asset'
import { Asset } from '@oceanprotocol/ddo-js'
import AddToken from '@shared/AddToken'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import React, { ReactElement } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import styles from './MetaAsset.module.css'
import { getOceanConfig } from '@utils/ocean'

export default function MetaAsset({
  asset,
  isBlockscoutExplorer
}: {
  asset: AssetExtended
  isBlockscoutExplorer: boolean
}): ReactElement {
  const { chain } = useNetwork()
  const chainId = chain?.id || 11155111
  const oceanConfig = getOceanConfig(chainId)
  const symbol = oceanConfig.oceanTokenSymbol
  const { isAssetNetwork } = useAsset()
  const { connector: activeConnector } = useAccount()

  const dataTokenSymbol = asset?.datatokens[0]?.symbol

  return (
    <div className={styles.wrapper}>
      <span className={styles.owner}>
        Owned by <Publisher account={asset?.indexedMetadata?.nft?.owner} />
      </span>
      <span>
        <ExplorerLink
          className={styles.datatoken}
          networkId={asset?.chainId}
          path={
            isBlockscoutExplorer
              ? `tokens/${asset?.services?.[0]?.datatokenAddress}`
              : `token/${asset?.services?.[0]?.datatokenAddress}`
          }
        >
          {`Accessed with ${dataTokenSymbol}`}
        </ExplorerLink>
        {activeConnector?.name === 'MetaMask' && isAssetNetwork && (
          <span className={styles.addWrap}>
            <AddToken
              address={asset?.services[0].datatokenAddress}
              symbol={symbol}
              text={`Add ${symbol} to wallet`}
              className={styles.add}
              minimal
            />
          </span>
        )}
      </span>
    </div>
  )
}
