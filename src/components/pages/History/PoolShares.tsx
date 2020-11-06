import { useMetadata, useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import { DDO, Logger, MetadataCache } from '@oceanprotocol/lib'
import PriceUnit from '../../atoms/Price/PriceUnit'
import Conversion from '../../atoms/Price/Conversion'
import styles from './PoolShares.module.css'
import AssetTitle from '../../molecules/AssetListTitle'

interface Asset {
  ddo: DDO
  shares: string
}

function TotalLiquidity({ ddo }: { ddo: DDO }): ReactElement {
  const { price } = useMetadata(ddo)
  const totalLiquidityInOcean = price?.ocean + price?.datatoken * price?.value

  return (
    <Conversion
      price={`${totalLiquidityInOcean}`}
      className={styles.totalLiquidity}
    />
  )
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: Asset) {
      const { attributes } = row.ddo.findServiceByType('metadata')
      const { owner } = row.ddo.publicKey[0]
      return (
        <AssetTitle
          did={row.ddo.id}
          title={attributes.main.name}
          owner={owner}
        />
      )
    },
    grow: 2
  },
  {
    name: 'Datatoken',
    selector: 'ddo.dataTokenInfo.symbol'
  },
  {
    name: 'Your Pool Shares',
    selector: function getAssetRow(row: Asset) {
      return <PriceUnit price={row.shares} symbol="pool shares" small />
    },
    right: true
  },
  {
    name: 'Total Pool Liquidity',
    selector: function getAssetRow(row: Asset) {
      return <TotalLiquidity ddo={row.ddo} />
    },
    right: true
  }
]

export default function PoolShares(): ReactElement {
  const { ocean, accountId, config } = useOcean()
  const [assets, setAssets] = useState<Asset[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getAssets() {
      if (!ocean || !accountId) return
      setIsLoading(true)

      try {
        const pools = await ocean.pool.getPoolSharesByAddress(accountId)
        const metadataCache = new MetadataCache(config.metadataCacheUri, Logger)
        const result: Asset[] = []

        for (const pool of pools) {
          const ddo = await metadataCache.retrieveDDO(pool.did)
          ddo && result.push({ ddo, shares: pool.shares })
        }

        setAssets(result)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getAssets()
  }, [ocean, accountId, config.metadataCacheUri])

  return <Table columns={columns} data={assets} isLoading={isLoading} />
}
