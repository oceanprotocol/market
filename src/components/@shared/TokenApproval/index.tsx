import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import Decimal from 'decimal.js'
import { getOceanConfig } from '@utils/ocean'
import { ButtonApprove } from './ButtonApprove'

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
  const { accountId } = useWeb3()

  const config = getOceanConfig(ddo.chainId)

  const tokenAddress =
    coin === 'OCEAN'
      ? config.oceanTokenAddress
      : ddo.services[0].datatokenAddress
  const spender = price.address

  const checkTokenApproval = useCallback(async () => {
    // if (!tokenAddress || !spender || !isAssetNetwork || !amount) return
    // const allowance = await ocean.datatokens.allowance(
    //   tokenAddress,
    //   accountId,
    //   spender
    // )
    // amount &&
    //   new Decimal(amount).greaterThan(new Decimal('0')) &&
    //   setTokenApproved(
    //     new Decimal(allowance).greaterThanOrEqualTo(new Decimal(amount))
    //   )
  }, [tokenAddress, spender, accountId, amount, isAssetNetwork])

  useEffect(() => {
    checkTokenApproval()
  }, [checkTokenApproval])

  async function approveTokens(amount: string) {
    setLoading(true)

    try {
      // await ocean.datatokens.approve(tokenAddress, spender, amount, accountId)
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
