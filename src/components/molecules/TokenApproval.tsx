import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../atoms/Button'
import { useOcean } from '../../providers/Ocean'
import { useAsset } from '../../providers/Asset'
import Loader from '../atoms/Loader'
import { useWeb3 } from '../../providers/Web3'
import { useUserPreferences } from '../../providers/UserPreferences'
import Tooltip from '../atoms/Tooltip'

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
  const { infiniteApproval } = useUserPreferences()

  const tooltipSpecific = `Give the smart contract permission to spend your ${coin} which has to be done for each transaction. You can optionally set this to infinite in your user preferences.`
  const tooltipInfinite = `Give the smart contract permission to spend infinte amounts of your ${coin} so you have to do this only once. You can disable allowing infinite amounts in your user preferences.`

  return infiniteApproval ? (
    <Button
      style="primary"
      size="small"
      onClick={() => approveTokens(`${2 ** 53 - 1}`)}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          Approve {coin} <Tooltip content={tooltipInfinite} />
        </>
      )}
    </Button>
  ) : (
    <Button style="primary" size="small" onClick={() => approveTokens(amount)}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          Approve {amount} {coin}
          {amount === '1' ? 'S' : ''}
          <Tooltip content={tooltipSpecific} />
        </>
      )}
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
    setTokenApproved(allowance >= amount)
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
