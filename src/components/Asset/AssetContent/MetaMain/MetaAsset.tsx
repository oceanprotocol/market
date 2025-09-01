import { useAsset } from '@context/Asset'
import AddToken from '@shared/AddToken'
import ExplorerLink from '@shared/ExplorerLink'
import Publisher from '@shared/Publisher'
import { ReactElement } from 'react'
import styles from './MetaAsset.module.css'
import { getOceanConfig } from '@utils/ocean'
import { useAppKitNetworkCore } from '@reown/appkit/react'

export default function MetaAsset({
  asset,
  isBlockscoutExplorer
}: {
  asset: AssetExtended
  isBlockscoutExplorer: boolean
}): ReactElement {
  const { chainId } = useAppKitNetworkCore()
  const oceanConfig = getOceanConfig(chainId)
  const symbol = oceanConfig.oceanTokenSymbol
  const { isAssetNetwork } = useAsset()
  const connector = 'metaMask'

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
        {connector === 'metaMask' && isAssetNetwork && (
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
