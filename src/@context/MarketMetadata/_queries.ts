import { gql } from 'urql'

export const opcQuery = gql`
  query OpcQuery {
    opc(id: 1) {
      swapOceanFee
      swapNonOceanFee
      approvedTokens {
        address: id
        symbol
        name
        decimals
      }
      id
    }
  }
`
