import { gql } from 'urql'

export const queryGlobalStatistics = gql`
  query FooterStatsValues {
    globalStatistics {
      nftCount
      datatokenCount
      orderCount
    }
  }
`
