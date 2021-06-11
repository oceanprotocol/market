import React, { ReactElement, useEffect, useState } from 'react'
import styles from './SyncStatus.module.css'
import Button from '../atoms/Button'
import { useOcean } from '../../providers/Ocean'
import { useAsset } from '../../providers/Asset'
import Loader from '../atoms/Loader'
import { useWeb3 } from '../../providers/Web3'

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
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
  const { ddo } = useAsset()
  const [approveToken, setApproveToken] = useState(false)
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
      if (!ocean) setApproveToken(false)
      return
    }
    const allowance = await ocean.datatokens.allowance(
      tokenAddress,
      accountId,
      spender
    )
    setTokenApproved(allowance >= amount)
    allowance > amount && setApproveToken(false)
  }

  useEffect(() => {
    checkTokenApproval()
  }, [])

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
    setApproveToken(false)
    await checkTokenApproval()
    setLoading(false)
  }

  return (
    <div className={styles.sync}>
      {loading ? (
        <LoaderArea />
      ) : approveToken === false ? (
        <>
          {tokenApproved || !ocean || (
            <Button
              style="primary"
              size="small"
              onClick={() => {
                setApproveToken(true)
              }}
              disabled={disabled}
            >
              Approve TOKEN
            </Button>
          )}
          {tokenApproved || !ocean ? actionButton : ''}
        </>
      ) : (
        <>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              approveTokens(amount)
            }}
            disabled={false}
          >
            {`${amount} ${coin}${amount === '1' ? 'S' : ''}`}
          </Button>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              const largeAmount = (2 ** 53 - 1).toString()
              approveTokens(largeAmount)
            }}
            disabled={false}
          >
            Infinite
          </Button>
        </>
      )}
    </div>
  )
}
