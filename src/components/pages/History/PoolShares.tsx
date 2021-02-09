import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
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
import Token from '../../organisms/AssetActions/Pool/Token'

const poolSharesQuery = gql`
  query PoolShares($user: String) {
    poolShares(where: { userAddress: $user, balance_gt: 0.001 }, first: 1000) {
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
        spotPrice
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
}

function findValidToken(tokens: PoolSharePoolIdTokens[]) {
  const symbol = tokens.find((token) => token.tokenId !== null)
  return symbol.tokenId.symbol
}

function Symbol({ tokens }: { tokens: PoolSharePoolIdTokens[] }) {
  return <>{findValidToken(tokens)}</>
}

function YourLiquidity({ row }: { row: Asset }) {
  return (
    <div className={styles.yourLiquidity}>
      <Conversion
        price={`${row.userLiquidity}`}
        className={styles.totalLiquidity}
        hideApproximateSymbol
      />
      <Token
        symbol="OCEAN"
        balance={(
          (row.poolShare.balance / row.poolShare.poolId.totalShares) *
          row.poolShare.poolId.oceanReserve
        ).toString()}
        noIcon
      />
      <Token
        symbol={findValidToken(row.poolShare.poolId.tokens)}
        balance={(
          (row.poolShare.balance / row.poolShare.poolId.totalShares) *
          row.poolShare.poolId.datatokenReserve
        ).toString()}
        noIcon
      />
    </div>
  )
}

function PoolLiquidity({ row }: { row: Asset }) {
  return (
    <div className={styles.yourLiquidity}>
      <Conversion
        price={`${
          Number(row.poolShare.poolId.oceanReserve) +
          Number(row.poolShare.poolId.datatokenReserve) *
            row.poolShare.poolId.consumePrice
        }`}
        className={styles.totalLiquidity}
        hideApproximateSymbol
      />
      <Token
        symbol="OCEAN"
        balance={row.poolShare.poolId.oceanReserve.toString()}
        noIcon
      />
      <Token
        symbol={findValidToken(row.poolShare.poolId.tokens)}
        balance={row.poolShare.poolId.datatokenReserve.toString()}
        noIcon
      />
    </div>
  )
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
    name: 'Pool Liquidity',
    selector: function getAssetRow(row: Asset) {
      return <PoolLiquidity row={row} />
    }
  },
  {
    name: 'Your Liquidity',
    selector: function getAssetRow(row: Asset) {
      return <YourLiquidity row={row} />
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
      className={styles.poolSharesTable}
      data={assets}
      isLoading={loading}
      sortField="userLiquidity"
      sortAsc={false}
    />
  )
}
