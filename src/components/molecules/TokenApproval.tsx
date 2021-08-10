import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../atoms/Button'
import { useOcean } from '../../providers/Ocean'
import { useAsset } from '../../providers/Asset'
import Loader from '../atoms/Loader'
import { useWeb3 } from '../../providers/Web3'
import { useUserPreferences } from '../../providers/UserPreferences'
import Tooltip from '../atoms/Tooltip'
import { graphql, useStaticQuery } from 'gatsby'

const query = graphql`
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

function ButtonApprove({
  amount,
  coin,
  approveTokens,
  isLoading
}: {
  amount: string
  coin: string
  approveTokens: (amount: string) => void
  isLoading: boolean
}) {
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
      onClick={() => approveTokens(`${2 ** 53 - 1}`)}
    >
      Approve {coin}{' '}
      <Tooltip content={content.approveInfinite.replace('COIN', coin)} />
    </Button>
  ) : (
    <Button style="primary" size="small" onClick={() => approveTokens(amount)}>
      Approve {amount} {coin}
      <Tooltip content={content.approveSpecific.replace('COIN', coin)} />)
    </Button>
  )
}

export default function TokenApproval({
  actionButton,
  amount,
  coin
}: {
  actionButton: JSX.Element
  disabled: boolean
  amount: string
  coin: string
}): ReactElement {
  const { ddo } = useAsset()
  // const [approveToken, setApproveToken] = useState(false)
  const [tokenApproved, setTokenApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { ocean, config } = useOcean()
  const { accountId } = useWeb3()

  const tokenAddress =
    coin === 'OCEAN' ? config.oceanTokenAddress : ddo.dataTokenInfo.address
  const spender = ocean
    ? coin === 'OCEAN'
      ? ocean.pool.oceanAddress
      : ocean.pool.dtAddress
    : undefined

  async function checkTokenApproval() {
    if (!ocean || !tokenAddress || !spender) {
      // if (!ocean) setApproveToken(false)
      return
    }
    const allowance = await ocean.datatokens.allowance(
      tokenAddress,
      accountId,
      spender
    )
    amount && Number(amount) > 0 && setTokenApproved(allowance >= amount)
    // allowance > amount && setApproveToken(false)
  }

  // useEffect(() => {
  //   checkTokenApproval()
  // }, [])

  useEffect(() => {
    checkTokenApproval()
  }, [coin, amount, spender])

  async function approveTokens(amount: string) {
    setLoading(true)
    try {
      await ocean.datatokens.approve(tokenAddress, spender, amount, accountId)
    } catch (error) {
      setLoading(false)
    }
    // setApproveToken(false)
    await checkTokenApproval()
    setLoading(false)
  }

  return (
    <>
      {tokenApproved ? (
        actionButton
      ) : (
        <ButtonApprove
          amount={amount}
          coin={coin}
          approveTokens={approveTokens}
          isLoading={loading}
        />
      )}
    </>
  )
}
