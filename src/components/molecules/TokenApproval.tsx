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
  const { ddo, owner } = useAsset()
  const [approveToken, setApproveToken] = useState(false)
  const [tokenApproved, setTokenApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { ocean, config } = useOcean()
  const { accountId } = useWeb3()

  const tokenAddress =
    coin === 'OCEAN' ? config.oceanTokenAddress : ddo.dataTokenInfo.address
  const spender =
    coin === 'OCEAN' ? ocean.pool.oceanAddress : ocean.pool.dtAddress

  async function checkTokenApproval() {
    setLoading(true)
    const allowance = await ocean.datatokens.allowance(
      tokenAddress,
      accountId,
      spender
    )
    setTokenApproved(allowance >= amount)
    allowance > amount && setApproveToken(false)
    setLoading(false)
  }

  useEffect(() => {
    checkTokenApproval()
  }, [coin, amount])

  useEffect(() => {
    checkTokenApproval()
  }, [])

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
          {tokenApproved || (
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
          {tokenApproved && actionButton}
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
            {`${amount} TOKEN${(amount = '1' ? 'S' : '')}`}
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
