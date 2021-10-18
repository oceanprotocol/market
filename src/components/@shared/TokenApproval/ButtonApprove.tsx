import React from 'react'
import Button from '@shared/atoms/Button'
import Loader from '@shared/atoms/Loader'
import { useUserPreferences } from '@context/UserPreferences'
import Tooltip from '@shared/atoms/Tooltip'
import { useStaticQuery, graphql } from 'gatsby'
import { ReactElement } from 'react-markdown'

export const query = graphql`
  query {
    content: allFile(filter: { relativePath: { eq: "price.json" } }) {
      edges {
        node {
          childContentJson {
            pool {
              tooltips {
                approveSpecific
                approveInfinite
              }
            }
          }
        }
      }
    }
  }
`

export function ButtonApprove({
  amount,
  coin,
  approveTokens,
  isLoading
}: {
  amount: string
  coin: string
  approveTokens: (amount: string) => void
  isLoading: boolean
}): ReactElement {
  // Get content
  const data = useStaticQuery(query)
  const content = data.content.edges[0].node.childContentJson.pool.tooltips

  const { infiniteApproval } = useUserPreferences()

  return isLoading ? (
    <Loader message={`Approving ${coin}...`} />
  ) : infiniteApproval ? (
    <Button
      style="primary"
      size="small"
      disabled={parseInt(amount) < 1}
      onClick={() => approveTokens(`${2 ** 53 - 1}`)}
    >
      Approve {coin}{' '}
      <Tooltip content={content.approveInfinite.replace('COIN', coin)} />
    </Button>
  ) : (
    <Button style="primary" size="small" onClick={() => approveTokens(amount)}>
      Approve {amount} {coin}
      <Tooltip content={content.approveSpecific.replace('COIN', coin)} />
    </Button>
  )
}
