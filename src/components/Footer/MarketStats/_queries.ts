import { gql } from 'urql'

export const queryGlobalStatistics = gql`
  query FooterStatsValues {
    globalStatistics {
      poolCount
      nftCount
      datatokenCount
      orderCount
      totalLiquidity {
        value
        token {
          address
          name
          symbol
        }
      }
    }
  }
`
