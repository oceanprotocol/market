import { gql } from 'urql'

export const poolDataQuery = gql`
  query PoolData(
    $pool: ID!
    $poolAsString: String!
    $owner: String!
    $user: String
  ) {
    poolData: pool(id: $pool) {
      id
      totalShares
      liquidityProviderSwapFee
      publishMarketSwapFee
      spotPrice
      baseToken {
        address
        symbol
        decimals
      }
      baseTokenWeight
      baseTokenLiquidity
      datatoken {
        address
        symbol
        decimals
      }
      datatokenWeight
      datatokenLiquidity
      shares(where: { user: $owner }) {
        shares
      }
    }
    poolDataUser: pool(id: $pool) {
      shares(where: { user: $user }) {
        shares
      }
    }
    poolSnapshots(first: 1000, where: { pool: $poolAsString }, orderBy: date) {
      date
      spotPrice
      baseTokenLiquidity
      datatokenLiquidity
      swapVolume
      baseToken {
        address
        symbol
        decimals
      }
      datatoken {
        address
        symbol
        decimals
      }
    }
  }
`
