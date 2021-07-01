import React, { ReactElement, useEffect, useState } from 'react'
import Table from '../../atoms/Table'
import Conversion from '../../atoms/Price/Conversion'
import styles from './PoolShares.module.css'
import AssetTitle from '../../molecules/AssetListTitle'
import { gql, OperationContext, useQuery } from 'urql'
import {
  PoolShares as PoolSharesList,
  PoolShares_poolShares as PoolShare,
  PoolShares_poolShares_poolId_tokens as PoolSharePoolIdTokens
} from '../../../@types/apollo/PoolShares'
import web3 from 'web3'
import Token from '../../organisms/AssetActions/Pool/Token'
import { useWeb3 } from '../../../providers/Web3'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { getOceanConfig } from '../../../utils/ocean'
import { getUrqlClientInstance } from '../../../providers/UrqlProvider'

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
    price = `${
      Number(row.poolShare.poolId.oceanReserve) +
      Number(row.poolShare.poolId.datatokenReserve) *
        row.poolShare.poolId.consumePrice
    }`
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

function getSubgrahUri(chainId: number): string {
  const config = getOceanConfig(chainId)
  return config.subgraphUri
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
  const [loading, setLoading] = useState<boolean>(false)
  const { chainIds } = useUserPreferences()

  useEffect(() => {
    const queryContext: OperationContext = {
      url: `${getSubgrahUri(
        chainIds[0]
      )}/subgraphs/name/oceanprotocol/ocean-subgraph`,
      requestPolicy: 'network-only'
    }
    const variables = { user: accountId?.toLowerCase() }
    const client = getUrqlClientInstance()

    async function getShares() {
      const assetList: Asset[] = []
      try {
        setLoading(true)
        const result = await client
          .query(poolSharesQuery, variables, queryContext)
          .toPromise()
        const { data } = result
        console.log('SHARED DATA: ', data.poolShares)
        if (!data) return
        data.poolShares.forEach((poolShare: PoolShare) => {
          const userLiquidity = calculateUserLiquidity(poolShare)
          assetList.push({
            poolShare: poolShare,
            userLiquidity: userLiquidity
          })
        })
        setAssets(assetList)
      } catch (error) {
        console.error('Error fetching pool shares: ', error.message)
      } finally {
        setLoading(false)
      }
    }

    getShares()
  }, [accountId, chainIds])

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
