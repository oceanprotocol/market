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
import web3 from 'web3'

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
        datatokenAddress
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
  const { data } = useQuery<PoolShare>(poolSharesQuery, {
    variables: {
      user: accountId?.toLowerCase()
    },
    pollInterval: 20000
  })

  useEffect(() => {
    if (!data) return
    setPools(data.poolShares)
  }, [data])

  useEffect(() => {
    async function getAssets() {
      if (!ocean || !accountId || !config?.metadataCacheUri) return
      setIsLoading(true)

      try {
        const metadataCache = new MetadataCache(config.metadataCacheUri, Logger)
        const result: Asset[] = []
        for (const pool of pools) {
          const did = web3.utils
            .toChecksumAddress(pool.poolId.datatokenAddress)
            .replace('0x', 'did:op:')
          const ddo = await metadataCache.retrieveDDO(did)
          ddo && result.push({ ddo, shares: pool.balance })
        }

        setAssets(result)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getAssets()
  }, [ocean, accountId, pools, config.metadataCacheUri])

  return <Table columns={columns} data={assets} isLoading={isLoading} />
}
