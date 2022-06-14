import { gql } from 'urql'

export const opcQuery = gql`
  query OpcQuery {
    opc(id: 1) {
      swapOceanFee
      swapNonOceanFee
      approvedTokens {
        id
      }
      id
    }
  }
`
