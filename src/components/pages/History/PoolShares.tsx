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
import { useWeb3 } from '../../../providers/Web3'

import { isValidNumber } from './../../../utils/numberValidations'
import Decimal from 'decimal.js'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

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
        valueLocked
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

function Liquidity({ row, type }: { row: Asset; type: string }) {
  let price = ``
  let oceanTokenBalance = ''
  let dataTokenBalance = ''
  if (type === 'user') {
    price = `${row.userLiquidity}`
    const userShare = row.poolShare.balance / row.poolShare.poolId.totalShares
    oceanTokenBalance = (
      userShare * row.poolShare.poolId.oceanReserve
    ).toString()
    dataTokenBalance = (
      userShare * row.poolShare.poolId.datatokenReserve
    ).toString()
  }
  if (type === 'pool') {
    price =
      isValidNumber(row.poolShare.poolId.oceanReserve) &&
      isValidNumber(row.poolShare.poolId.datatokenReserve) &&
      isValidNumber(row.poolShare.poolId.consumePrice)
        ? new Decimal(row.poolShare.poolId.datatokenReserve)
            .mul(new Decimal(row.poolShare.poolId.consumePrice))
            .plus(row.poolShare.poolId.oceanReserve)
            .toString()
        : '0'

    oceanTokenBalance = row.poolShare.poolId.oceanReserve.toString()
    dataTokenBalance = row.poolShare.poolId.datatokenReserve.toString()
  }
  return (
    <div className={styles.yourLiquidity}>
      <Conversion
        price={price}
        className={styles.totalLiquidity}
        hideApproximateSymbol
      />
      <Token symbol="OCEAN" balance={oceanTokenBalance} noIcon />
      <Token
        symbol={findValidToken(row.poolShare.poolId.tokens)}
        balance={dataTokenBalance}
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
    name: 'Your Liquidity',
    selector: function getAssetRow(row: Asset) {
      return <Liquidity row={row} type="user" />
    },
    right: true
  },
  {
    name: 'Pool Liquidity',
    selector: function getAssetRow(row: Asset) {
      return <Liquidity row={row} type="pool" />
    },
    right: true
  }
]

export default function PoolShares(): ReactElement {
  const { accountId } = useWeb3()
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
      pagination
      paginationPerPage={5}
      isLoading={loading}
      sortField="userLiquidity"
      sortAsc={false}
    />
  )
}
