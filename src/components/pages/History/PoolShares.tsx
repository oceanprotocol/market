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
  PoolShares_poolShares as PoolShare
} from '../../../@types/apollo/PoolShares'
import web3 from 'web3'

const poolSharesQuery = gql`
  query PoolShares($user: String) {
    poolShares(
      orderBy: balance
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
        lockedValue
      }
    }
  }
`

function UserLiquidity({ lockedValue }: { lockedValue: string }): ReactElement {
  return (
    <Conversion price={`${lockedValue}`} className={styles.totalLiquidity} />
  )
}

function Symbol({ tokenAddress }: { tokenAddress: string }) {
  const { ocean } = useOcean()
  const [symbol, setSymbol] = useState<string>()
  ocean.pool.oceanAddress.toLowerCase() === tokenAddress.toLowerCase()
    ? setSymbol('OCEAN')
    : ocean.datatokens.getSymbol(tokenAddress).then((value) => {
        setSymbol(value)
      })
  return <>{symbol}</>
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
      return <Symbol tokenAddress={row.poolId.datatokenAddress} />
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
      return <UserLiquidity lockedValue={row.poolId.lockedValue} />
    },
    right: true
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

  return <Table columns={columns} data={assets} isLoading={loading} />
}
