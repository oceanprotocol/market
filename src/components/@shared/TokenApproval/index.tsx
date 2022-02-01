import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import Decimal from 'decimal.js'
import { ButtonApprove } from './ButtonApprove'
import { allowance, approve, LoggerInstance } from '@oceanprotocol/lib'

export default function TokenApproval({
  actionButton,
  disabled,
  amount,
  tokenAddress,
  tokenSymbol
}: {
  actionButton: JSX.Element
  disabled: boolean
  amount: string
  tokenAddress: string
  tokenSymbol: string
}): ReactElement {
  const { price, isAssetNetwork } = useAsset()
  const [tokenApproved, setTokenApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { web3, accountId } = useWeb3()

  const spender = price?.address

  const checkTokenApproval = useCallback(async () => {
    if (!web3 || !tokenAddress || !spender || !isAssetNetwork || !amount) return

    const allowanceValue = await allowance(
      web3,
      tokenAddress,
      accountId,
      spender
    )
    LoggerInstance.log(`[token approval] allowanceValue: ${allowanceValue}`)

    if (!allowanceValue) return

    new Decimal(amount).greaterThan(new Decimal('0')) &&
      setTokenApproved(
        new Decimal(allowanceValue).greaterThanOrEqualTo(new Decimal(amount))
      )
  }, [web3, tokenAddress, spender, accountId, amount, isAssetNetwork])

  useEffect(() => {
    checkTokenApproval()
  }, [checkTokenApproval])

  async function approveTokens(amount: string) {
    setLoading(true)

    try {
      const tx = await approve(web3, accountId, tokenAddress, spender, amount)
      LoggerInstance.log(`[token approval] Approve tokens tx:`, tx)
    } catch (error) {
      LoggerInstance.error(
        `[token approval] Approve tokens tx failed:`,
        error.message
      )
    } finally {
      await checkTokenApproval()
      setLoading(false)
    }
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
          tokenSymbol={tokenSymbol}
          approveTokens={approveTokens}
          isLoading={loading}
        />
      )}
    </>
  )
}
