import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { Asset } from '@oceanprotocol/lib'
import AddToken from '@shared/AddToken'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import React, { ReactElement } from 'react'
import { AssetExtended } from 'src/@types/AssetExtended'
import styles from './MetaAsset.module.css'

export default function MetaAsset({
  asset,
  isBlockscoutExplorer
}: {
  asset: AssetExtended
  isBlockscoutExplorer: boolean
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3ProviderInfo } = useWeb3()

  const dataTokenSymbol = asset?.datatokens[0]?.symbol

  return (
    <div className={styles.wrapper}>
      <span className={styles.owner}>
        Owned by <Publisher account={asset?.nft?.owner} />
      </span>
      <span>
        <ExplorerLink
          className={styles.datatoken}
          networkId={asset?.chainId}
          path={
            isBlockscoutExplorer
              ? `tokens/${asset?.services[0].datatokenAddress}`
              : `token/${asset?.services[0].datatokenAddress}`
          }
        >
          {`Accessed with ${dataTokenSymbol}`}
        </ExplorerLink>
        {web3ProviderInfo?.name === 'MetaMask' && isAssetNetwork && (
          <span className={styles.addWrap}>
            <AddToken
              address={asset?.services[0].datatokenAddress}
              symbol={(asset as Asset)?.datatokens[0]?.symbol}
              logo="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
              text={`Add ${(asset as Asset)?.datatokens[0]?.symbol} to wallet`}
              className={styles.add}
              minimal
            />
          </span>
        )}
      </span>
    </div>
  )
}
