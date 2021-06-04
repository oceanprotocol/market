import React, { ReactElement, useEffect, useState } from 'react'
import styles from './SyncStatus.module.css'
import Button from '../atoms/Button'
import { useOcean } from '../../providers/Ocean'
import { useWeb3 } from '../../providers/Web3'
import { useAsset } from '../../providers/Asset'
import Loader from '../atoms/Loader'

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
  const { accountId } = useWeb3()
  const { ddo, owner, price } = useAsset()
  const [approveToken, setApproveToken] = useState(false)
  const [tokenApproved, setTokenApproved] = useState(false)
  const [loading, setLoading] = useState(false)
  const { ocean, config } = useOcean()

  const tokenAddress =
    coin === 'OCEAN' ? config.oceanTokenAddress : ddo.dataTokenInfo.address
  const spender =
    coin === 'OCEAN' ? ocean.pool.oceanAddress : ocean.pool.dtAddress

  async function checkTokenApproval() {
    setLoading(true)
    const allowance = await ocean.datatokens.allowance(
      tokenAddress,
      owner,
      spender // marketplace address,
    )
    setTokenApproved(allowance !== '0')
    setLoading(false)
  }

  useEffect(() => {
    checkTokenApproval()
  }, [coin])

  useEffect(() => {
    checkTokenApproval()
  }, [])

  async function approveTokens() {
    setLoading(true)
    const tsx = await ocean.datatokens.approve(
      tokenAddress,
      spender,
      amount,
      owner
    )
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
          {actionButton}
        </>
      ) : (
        <>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              approveTokens()
            }}
            disabled={false}
          >
            {amount} TOKEN
          </Button>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              approveTokens()
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
