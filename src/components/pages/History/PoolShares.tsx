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
  PoolShares_poolShares_poolId_tokens
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
        spotPrice
      }
    }
  }
`

function UserLiquidity({ row }: { row: PoolShare }): ReactElement {
  console.log('balance', row.balance)
  console.log('totalShares', row.poolId.totalShares)
  console.log('oceanReserve', row.poolId.oceanReserve)
  console.log('datatokenReserve', row.poolId.datatokenReserve)
  console.log('spotPrice', row.poolId.spotPrice)
  console.log('-------------------------------------')
  const ocean = (row.balance / row.poolId.totalShares) * row.poolId.oceanReserve
  const datatokens =
    (row.balance / row.poolId.totalShares) * row.poolId.datatokenReserve
  const totalLiquidity = ocean + datatokens * row.poolId.spotPrice
  return (
    <Conversion price={`${totalLiquidity}`} className={styles.totalLiquidity} />
  )
}

function Symbol({ tokens }: { tokens: PoolShares_poolShares_poolId_tokens[] }) {
  const symbol = tokens.find((token) => token.tokenId !== null)
  return <>{symbol.tokenId.symbol}</>
}

const columns = [
  {
    name: 'Data Set',
    selector: function getAssetRow(row: PoolShare) {
      const did = web3.utils
        .toChecksumAddress(row.poolId.datatokenAddress)
        .replace('0x', 'did:op:')
      return <AssetTitle did={did} />
    },
    grow: 2
  },
  {
    name: 'Datatoken',
    selector: function getSymbol(row: PoolShare) {
      return <Symbol tokens={row.poolId.tokens} />
    }
  },
  {
    name: 'Your Pool Shares',
    selector: function getAssetRow(row: PoolShare) {
      return <PriceUnit price={row.balance} symbol="pool shares" small />
    },
    right: true
  },
  {
    name: 'Value',
    selector: function getAssetRow(row: PoolShare) {
      return <UserLiquidity row={row} />
    },
    right: true,
    sortable: true
  }
]

export default function PoolShares(): ReactElement {
  const { accountId } = useOcean()
  const [assets, setAssets] = useState<PoolShare[]>()
  const { data, loading } = useQuery<PoolSharesList>(poolSharesQuery, {
    variables: {
      user: accountId?.toLowerCase()
    },
    pollInterval: 20000
  })

  useEffect(() => {
    if (!data) return
    setAssets(data.poolShares)
  }, [data, loading])

  return (
    <Table
      columns={columns}
      data={assets}
      isLoading={loading}
      sortField="Datatoken"
    />
  )
}
