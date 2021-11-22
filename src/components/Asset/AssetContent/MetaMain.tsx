import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import AddToken from '@shared/AddToken'
import Time from '@shared/atoms/Time'
import AssetType from '@shared/AssetType'
import styles from './MetaMain.module.css'
import { getServiceByName } from '@utils/ddo'

export default function MetaMain({ ddo }: { ddo: Asset | DDO }): ReactElement {
  const { owner, isAssetNetwork } = useAsset()
  const { web3ProviderInfo } = useWeb3()

  const isCompute = Boolean(getServiceByName(ddo, 'compute'))
  const accessType = isCompute ? 'compute' : 'access'
  const blockscoutNetworks = [1287, 2021000, 2021001, 44787, 246, 1285]
  const isBlockscoutExplorer = blockscoutNetworks.includes(ddo?.chainId)

  return (
    <aside className={styles.meta}>
      <header className={styles.asset}>
        <AssetType
          type={ddo?.metadata.type}
          accessType={accessType}
          className={styles.assetType}
        />
        <ExplorerLink
          className={styles.datatoken}
          networkId={ddo?.chainId}
          path={
            isBlockscoutExplorer
              ? `tokens/${ddo?.services[0].datatokenAddress}`
              : `token/${ddo?.services[0].datatokenAddress}`
          }
        >
          {`${(ddo as Asset)?.dataTokenInfo?.name} — ${
            (ddo as Asset)?.dataTokenInfo?.symbol
          }`}
        </ExplorerLink>

        {web3ProviderInfo?.name === 'MetaMask' && isAssetNetwork && (
          <span className={styles.addWrap}>
            <AddToken
              address={ddo?.services[0].datatokenAddress}
              symbol={(ddo as Asset)?.dataTokenInfo?.symbol}
              logo="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
              text={`Add ${(ddo as Asset)?.dataTokenInfo?.symbol} to wallet`}
              className={styles.add}
              minimal
            />
          </span>
        )}
      </header>

      <div className={styles.byline}>
        Published By <Publisher account={owner} />
        <p>
          <Time date={ddo?.metadata.created} relative />
          {ddo?.metadata.created !== ddo?.metadata.updated && (
            <>
              {' — '}
              <span className={styles.updated}>
                updated <Time date={ddo?.metadata.updated} relative />
              </span>
            </>
          )}
        </p>
      </div>
    </aside>
  )
}
