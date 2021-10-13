import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import { useOcean } from '@context/Ocean'
import { useAsset } from '@context/Asset'
import Loader from '@shared/atoms/Loader'
import { useWeb3 } from '@context/Web3'
import { useUserPreferences } from '@context/UserPreferences'
import Tooltip from '@shared/atoms/Tooltip'
import { graphql, useStaticQuery } from 'gatsby'
import Decimal from 'decimal.js'
import { getOceanConfig } from '@utils/ocean'

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

export default function TokenApproval({
  actionButton,
  disabled,
  amount,
  coin
}: {
  actionButton: JSX.Element
  disabled: boolean
  amount: string
  coin: string
}): ReactElement {
  const { ddo, price, isAssetNetwork } = useAsset()
  const [tokenApproved, setTokenApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { ocean } = useOcean()
  const { accountId } = useWeb3()

  const config = getOceanConfig(ddo.chainId)

  const tokenAddress =
    coin === 'OCEAN' ? config.oceanTokenAddress : ddo.dataTokenInfo.address
  const spender = price.address

  const checkTokenApproval = useCallback(async () => {
    if (!ocean || !tokenAddress || !spender || !isAssetNetwork || !amount)
      return

    const allowance = await ocean.datatokens.allowance(
      tokenAddress,
      accountId,
      spender
    )

    amount &&
      new Decimal(amount).greaterThan(new Decimal('0')) &&
      setTokenApproved(
        new Decimal(allowance).greaterThanOrEqualTo(new Decimal(amount))
      )
  }, [ocean, tokenAddress, spender, accountId, amount])

  useEffect(() => {
    checkTokenApproval()
  }, [checkTokenApproval])

  async function approveTokens(amount: string) {
    setLoading(true)

    try {
      await ocean.datatokens.approve(tokenAddress, spender, amount, accountId)
    } catch (error) {
      setLoading(false)
    }

    await checkTokenApproval()
    setLoading(false)
  }

  return (
    <>
      {tokenApproved ||
      disabled ||
      amount === '0' ||
      amount === '' ||
      !amount ||
      typeof amount === 'undefined' ? (
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
