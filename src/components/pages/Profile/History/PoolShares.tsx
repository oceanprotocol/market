import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Table from '../../../atoms/Table'
import Conversion from '../../../atoms/Price/Conversion'
import styles from './PoolShares.module.css'
import AssetTitle from '../../../molecules/AssetListTitle'
import {
  PoolShares_poolShares as PoolShare,
  PoolShares_poolShares_poolId_tokens as PoolSharePoolIdTokens
} from '../../../../@types/apollo/PoolShares'
import web3 from 'web3'
import Token from '../../../organisms/AssetActions/Pool/Token'
import { calculateUserLiquidity } from '../../../../utils/subgraph'
import NetworkName from '../../../atoms/NetworkName'
import { CancelToken } from 'axios'
import { retrieveDDO } from '../../../../utils/aquarius'
import { isValidNumber } from '../../../../utils/numberValidations'
import Decimal from 'decimal.js'
import { useProfile } from '../../../../providers/Profile'
import { DDO } from '@oceanprotocol/lib'
import { useCancelToken } from '../../../../hooks/useCancelToken'
import { useUserPreferences } from '../../../../providers/UserPreferences'

Decimal.set({ toExpNeg: -18, precision: 18, rounding: 1 })

const REFETCH_INTERVAL = 20000

interface Asset {
  userLiquidity: number
  poolShare: PoolShare
  networkId: number
  createTime: number
  ddo: DDO
}

function findTokenByType(tokens: PoolSharePoolIdTokens[], type: string) {
  const { symbol } = tokens.find((token) =>
    type === 'datatoken'
      ? token.isDatatoken === true
      : token.isDatatoken === false
  )
  return symbol
}

function Symbol({ tokens }: { tokens: PoolSharePoolIdTokens[] }) {
  return <>{findTokenByType(tokens, 'datatoken')}</>
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
    <div className={styles.userLiquidity}>
      <Conversion
        price={price}
        className={styles.totalLiquidity}
        hideApproximateSymbol
      />
      <Token
        symbol={findTokenByType(row.poolShare.poolId.tokens, 'ocean')}
        balance={oceanTokenBalance}
        noIcon
      />
      <Token
        symbol={findTokenByType(row.poolShare.poolId.tokens, 'datatoken')}
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
      return <AssetTitle ddo={row.ddo} />
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
    name: 'Liquidity',
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

async function getPoolSharesAssets(
  data: PoolShare[],
  cancelToken: CancelToken
) {
  const assetList: Asset[] = []

  for (let i = 0; i < data.length; i++) {
    const did = web3.utils
      .toChecksumAddress(data[i].poolId.datatokenAddress)
      .replace('0x', 'did:op:')
    const ddo = await retrieveDDO(did, cancelToken)
    const userLiquidity = calculateUserLiquidity(data[i])

    ddo &&
      assetList.push({
        poolShare: data[i],
        userLiquidity: userLiquidity,
        networkId: ddo?.chainId,
        createTime: data[i].poolId.createTime,
        ddo
      })
  }
  const assets = assetList.sort((a, b) => b.createTime - a.createTime)
  return assets
}

export default function PoolShares({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { poolShares, isPoolSharesLoading } = useProfile()
  const [assets, setAssets] = useState<Asset[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [dataFetchInterval, setDataFetchInterval] = useState<NodeJS.Timeout>()
  const newCancelToken = useCancelToken()
  const { chainIds } = useUserPreferences()

  const fetchPoolSharesAssets = useCallback(
    async (cancelToken: CancelToken) => {
      if (!poolShares || isPoolSharesLoading) return

      try {
        const assets = await getPoolSharesAssets(poolShares, cancelToken)
        setAssets(assets)
      } catch (error) {
        console.error('Error fetching pool shares: ', error.message)
      }
    },
    [poolShares, isPoolSharesLoading]
  )

  useEffect(() => {
    const cancelToken = newCancelToken()
    async function init() {
      setLoading(true)
      await fetchPoolSharesAssets(cancelToken)
      setLoading(false)

      if (dataFetchInterval) return
      const interval = setInterval(async () => {
        await fetchPoolSharesAssets(cancelToken)
      }, REFETCH_INTERVAL)
      setDataFetchInterval(interval)
    }
    init()

    return () => {
      clearInterval(dataFetchInterval)
    }
  }, [dataFetchInterval, fetchPoolSharesAssets, newCancelToken])

  return chainIds.length === 0 ? (
    <div>Please select a network.</div>
  ) : accountId ? (
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
