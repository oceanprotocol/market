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
import { retrieveDDOListByDIDs } from '../../../../utils/aquarius'
import { CancelToken } from 'axios'
import { isValidNumber } from '../../../../utils/numberValidations'
import Decimal from 'decimal.js'
import { useProfile } from '../../../../providers/Profile'
import { DDO } from '@oceanprotocol/lib'
import { useCancelToken } from '../../../../hooks/useCancelToken'
import { useIsMounted } from '../../../../hooks/useIsMounted'
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
      isValidNumber(row.poolShare.poolId.spotPrice)
        ? new Decimal(row.poolShare.poolId.datatokenReserve)
            .mul(new Decimal(row.poolShare.poolId.spotPrice))
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
  chainIds: number[],
  cancelToken: CancelToken
) {
  if (data.length < 1) return

  const assetList: Asset[] = []
  const didList: string[] = []

  for (let i = 0; i < data.length; i++) {
    const did = web3.utils
      .toChecksumAddress(data[i].poolId.datatokenAddress)
      .replace('0x', 'did:op:')
    didList.push(did)
  }
  const ddoList = await retrieveDDOListByDIDs(didList, chainIds, cancelToken)

  for (let i = 0; i < data.length; i++) {
    const userLiquidity = calculateUserLiquidity(data[i])
    assetList.push({
      poolShare: data[i],
      userLiquidity: userLiquidity,
      networkId: ddoList[i].chainId,
      createTime: data[i].poolId.createTime,
      ddo: ddoList[i]
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
  const { chainIds } = useUserPreferences()
  const newCancelToken = useCancelToken()
  const isMounted = useIsMounted()

  const fetchPoolSharesAssets = useCallback(
    async (
      chainIds: number[],
      poolShares: PoolShare[],
      cancelToken: CancelToken
    ) => {
      try {
        const assets = await getPoolSharesAssets(
          poolShares,
          chainIds,
          cancelToken
        )
        setAssets(assets)
      } catch (error) {
        console.error('Error fetching pool shares: ', error.message)
      } finally {
        setLoading(false)
      }
    },
    []
  )
  // do not add chainIds,dataFetchInterval to effect dep
  useEffect(() => {
    const cancelToken = newCancelToken()
    async function init() {
      setLoading(true)

      if (!poolShares || isPoolSharesLoading || !chainIds || !isMounted())
        return
      await fetchPoolSharesAssets(chainIds, poolShares, cancelToken)
      setLoading(false)

      if (dataFetchInterval) return

      const interval = setInterval(async () => {
        await fetchPoolSharesAssets(chainIds, poolShares, cancelToken)
      }, REFETCH_INTERVAL)
      setDataFetchInterval(interval)
    }
    init()

    return () => {
      clearInterval(dataFetchInterval)
    }
  }, [
    fetchPoolSharesAssets,
    isPoolSharesLoading,
    newCancelToken,
    poolShares,
    isMounted
  ])

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
