import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import PriceUnit from '../../atoms/Price/PriceUnit'
import Conversion from '../../atoms/Price/Conversion'
import styles from './PoolShares.module.css'
import AssetTitle from '../../molecules/AssetListTitle'
import { gql, useQuery } from '@apollo/client'
import {
  PoolShares as PoolSharesList,
  PoolShares_poolShares as PoolShare,
  PoolShares_poolShares_poolId_tokens as PoolSharePoolIdTokens
} from '../../../@types/apollo/PoolShares'
import web3 from 'web3'

const poolSharesQuery = gql`
  query PoolShares($user: String) {
    poolShares(
      orderBy: balance
      orderDirection: desc
      where: { userAddress: $user, balance_gt: 0.001 }
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
        lockedValue
        tokens {
          tokenId {
            symbol
          }
        }
        oceanReserve
        datatokenReserve
        totalShares
        consumePrice
      }
    }
  }
`

interface Asset {
  userLiquidity: number
  poolShare: PoolShare
}

function calculateUserLiquidity(poolShare: PoolShare) {
  const ocean =
    (poolShare.balance / poolShare.poolId.totalShares) *
    poolShare.poolId.oceanReserve
  const datatokens =
    (poolShare.balance / poolShare.poolId.totalShares) *
    poolShare.poolId.datatokenReserve
  const totalLiquidity = ocean + datatokens * poolShare.poolId.consumePrice
  return totalLiquidity
  // <Conversion price={`${totalLiquidity}`} className={styles.totalLiquidity} />
}

function Symbol({ tokens }: { tokens: PoolSharePoolIdTokens[] }) {
  const symbol = tokens.find((token) => token.tokenId !== null)
  return <>{symbol.tokenId.symbol}</>
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: Asset) {
      const did = web3.utils
        .toChecksumAddress(row.poolShare.poolId.datatokenAddress)
        .replace('0x', 'did:op:')
      return <AssetTitle did={did} />
    },
    grow: 2
  },
  {
    name: 'Datatoken',
    selector: function getSymbol(row: Asset) {
      return <Symbol tokens={row.poolShare.poolId.tokens} />
    }
  },
  {
    name: 'Your Pool Shares',
    selector: function getAssetRow(row: Asset) {
      return (
        <PriceUnit price={row.poolShare.balance} symbol="pool shares" small />
      )
    },
    right: true
  },
  {
    name: 'Value',
    selector: function getAssetRow(row: Asset) {
      return (
        <Conversion
          price={`${row.userLiquidity}`}
          className={styles.totalLiquidity}
        />
      )
    },
    right: true
  }
]

export default function PoolShares(): ReactElement {
  const { accountId } = useOcean()
  const [assets, setAssets] = useState<Asset[]>()
  const { data, loading } = useQuery<PoolSharesList>(poolSharesQuery, {
    variables: {
      user: accountId?.toLowerCase()
    },
    pollInterval: 20000
  })

  useEffect(() => {
    if (!data) return
    const assetList: Asset[] = []
    data.poolShares.forEach((poolShare) => {
      const userLiquidity = calculateUserLiquidity(poolShare)
      assetList.push({
        poolShare: poolShare,
        userLiquidity: userLiquidity
      })
    })
    setAssets(assetList)
  }, [data, loading])

  return (
    <Table
      columns={columns}
      data={assets}
      isLoading={loading}
      sortField="userLiquidity"
      sortAsc={false}
    />
  )
}
