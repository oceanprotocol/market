import React, { ReactElement } from 'react'
import { useAsset } from '../../../providers/Asset'
import { useWeb3 } from '../../../providers/Web3'
import ExplorerLink from '../../atoms/ExplorerLink'
import AssetType from '../../atoms/AssetType'
import Publisher from '../../atoms/Publisher'
import AddToken from '../../atoms/AddToken'
import Time from '../../atoms/Time'
import {
  meta,
  asset,
  assetType,
  datatoken,
  addWrap,
  add,
  byline,
  updated
} from './MetaMain.module.css'

export default function MetaMain(): ReactElement {
  const { ddo, owner, type } = useAsset()
  const { networkId, web3ProviderInfo } = useWeb3()
  const isCompute = Boolean(ddo?.findServiceByType('compute'))
  const accessType = isCompute ? 'compute' : 'access'

  return (
    <aside className={meta}>
      <header className={asset}>
        <AssetType type={type} accessType={accessType} className={assetType} />
        <ExplorerLink
          className={datatoken}
          networkId={networkId}
          path={
            networkId === 137 || networkId === 1287
              ? `tokens/${ddo?.dataToken}`
              : `token/${ddo?.dataToken}`
          }
        >
          {`${ddo?.dataTokenInfo.name} — ${ddo?.dataTokenInfo.symbol}`}
        </ExplorerLink>

        {web3ProviderInfo?.name === 'MetaMask' && (
          <span className={addWrap}>
            <AddToken
              address={ddo?.dataTokenInfo.address}
              symbol={ddo?.dataTokenInfo.symbol}
              logo="https://raw.githubusercontent.com/oceanprotocol/art/main/logo/datatoken.png"
              text={`Add ${ddo?.dataTokenInfo.symbol} to wallet`}
              className={add}
              minimal
            />
          </span>
        )}
      </header>

      <div className={byline}>
        Published By <Publisher account={owner} />
        <p>
          <Time date={ddo?.created} relative />
          {ddo?.created !== ddo?.updated && (
            <>
              {' — '}
              <span className={updated}>
                updated <Time date={ddo?.updated} relative />
              </span>
            </>
          )}
        </p>
      </div>
    </aside>
  )
}
