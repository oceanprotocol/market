import { useMetadata, useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import { DDO, Logger, MetadataCache } from '@oceanprotocol/lib'
import PriceUnit from '../../atoms/Price/PriceUnit'
import Conversion from '../../atoms/Price/Conversion'
import styles from './PoolShares.module.css'
import AssetTitle from '../../molecules/AssetListTitle'
import { gql, useQuery } from '@apollo/client'
import { PoolShares as PoolShare } from '../../../@types/apollo/PoolShares'

const poolSharesQuery = gql`
  query PoolShares($user: String) {
    poolShares(
      orderDirection: desc
      where: { userAddress: $user }
      first: 1000
    ) {
      id
      balance
      userAddress {
        id
      }
      poolId {
        id
      }
    }
  }
`

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
      return <AssetTitle ddo={row.ddo} />
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
  const [pools, setPools] = useState([])
  const { data, loading } = useQuery<PoolShare>(poolSharesQuery, {
    variables: {
      user: '0x020a507256a55f006e86d0b9d3b2f6546f2deb9a'
    },
    pollInterval: 20000
  })
  console.log(accountId.toLowerCase())

  useEffect(() => {
    if (!data) return
    console.log(data.poolShares)
    setPools(data.poolShares)
  }, [data, loading])

  useEffect(() => {
    async function getAssets() {
      if (!ocean || !accountId || !config?.metadataCacheUri) return
      setIsLoading(true)

      try {
        const pools = await ocean.pool.getPoolSharesByAddress(accountId)
        const metadataCache = new MetadataCache(config.metadataCacheUri, Logger)
        const result: Asset[] = []

        for (const pool of pools) {
          console.log(pool)
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
