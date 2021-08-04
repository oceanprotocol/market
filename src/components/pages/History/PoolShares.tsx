import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import Conversion from '../../atoms/Price/Conversion'
import styles from './PoolShares.module.css'
import AssetTitle from '../../molecules/AssetListTitle'
import { gql } from 'urql'
import {
  PoolShares as PoolSharesList,
  PoolShares_poolShares as PoolShare,
  PoolShares_poolShares_poolId_tokens as PoolSharePoolIdTokens
} from '../../../@types/apollo/PoolShares'
import web3 from 'web3'
import Token from '../../organisms/AssetActions/Pool/Token'
import { useWeb3 } from '../../../providers/Web3'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { fetchDataForMultipleChains } from '../../../utils/subgraph'
import NetworkName from '../../atoms/NetworkName'
import axios from 'axios'
import { retrieveDDO } from '../../../utils/aquarius'

const REFETCH_INTERVAL = 20000

import { isValidNumber } from './../../../utils/numberValidations'
import Decimal from 'decimal.js'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

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
        createTime
      }
    }
  }
`

interface Asset {
  userLiquidity: number
  poolShare: PoolShare
  networkId: number
  createTime: number
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
    name: 'Network',
    selector: function getNetwork(row: Asset) {
      return <NetworkName networkId={row.networkId} />
    }
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
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<PoolShare[]>()
  const [dataFetchInterval, setDataFetchInterval] = useState<NodeJS.Timeout>()
  const { chainIds } = useUserPreferences()

  async function fetchPoolSharesData() {
    const variables = { user: accountId?.toLowerCase() }
    const shares: PoolShare[] = []
    const result = await fetchDataForMultipleChains(
      poolSharesQuery,
      variables,
      chainIds
    )
    for (let i = 0; i < result.length; i++) {
      result[i].poolShares.forEach((poolShare: PoolShare) => {
        shares.push(poolShare)
      })
    }
    if (JSON.stringify(data) !== JSON.stringify(shares)) {
      setData(shares)
    }
  }

  function refetchPoolShares() {
    if (!dataFetchInterval) {
      setDataFetchInterval(
        setInterval(function () {
          fetchPoolSharesData()
        }, REFETCH_INTERVAL)
      )
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(dataFetchInterval)
    }
  }, [dataFetchInterval])

  useEffect(() => {
    async function getShares() {
      const assetList: Asset[] = []
      const source = axios.CancelToken.source()

      try {
        setLoading(true)
        if (!data) {
          await fetchPoolSharesData()
          return
        }
        for (let i = 0; i < data.length; i++) {
          const did = web3.utils
            .toChecksumAddress(data[i].poolId.datatokenAddress)
            .replace('0x', 'did:op:')
          const ddo = await retrieveDDO(did, source.token)
          const userLiquidity = calculateUserLiquidity(data[i])
          assetList.push({
            poolShare: data[i],
            userLiquidity: userLiquidity,
            networkId: ddo.chainId,
            createTime: data[i].poolId.createTime
          })
        }
        const orderedAssets = assetList.sort(
          (a, b) => b.createTime - a.createTime
        )
        setAssets(orderedAssets)
        refetchPoolShares()
      } catch (error) {
        console.error('Error fetching pool shares: ', error.message)
      } finally {
        setLoading(false)
      }
    }

    getShares()
  }, [accountId, chainIds, data])

  return accountId ? (
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
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
