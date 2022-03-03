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
      opcFee
      publishMarketSwapFee
      spotPrice
      baseToken {
        address
        symbol
      }
      baseTokenWeight
      baseTokenLiquidity
      datatoken {
        address
        symbol
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
      }
      datatoken {
        address
        symbol
      }
    }
  }
`
