import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { Asset } from '@oceanprotocol/lib'
import AddToken from '@shared/AddToken'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import React, { ReactElement } from 'react'
import styles from './MetaAsset.module.css'

export default function MetaAsset({
  ddo,
  isBlockscoutExplorer
}: {
  ddo: Asset
  isBlockscoutExplorer: boolean
}): ReactElement {
  const { isAssetNetwork } = useAsset()
  const { web3ProviderInfo } = useWeb3()

  const dataTokenSymbol = ddo?.datatokens[0]?.symbol

  return (
    <div className={styles.wrapper}>
      <span className={styles.owner}>
        Owned by <Publisher account={ddo?.nft?.owner} />
      </span>
      <span>
        <ExplorerLink
          className={styles.datatoken}
          networkId={ddo?.chainId}
          path={
            isBlockscoutExplorer
              ? `tokens/${ddo?.services[0].datatokenAddress}`
              : `token/${ddo?.services[0].datatokenAddress}`
          }
        >
          {`Accessed with ${dataTokenSymbol}`}
        </ExplorerLink>
        {web3ProviderInfo?.name === 'MetaMask' && isAssetNetwork && (
          <span className={styles.addWrap}>
            <AddToken
              address={ddo?.services[0].datatokenAddress}
              symbol={(ddo as Asset)?.datatokens[0]?.symbol}
              logo="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
              text={`Add ${(ddo as Asset)?.datatokens[0]?.symbol} to wallet`}
              className={styles.add}
              minimal
            />
          </span>
        )}
      </span>
    </div>
  )
}
