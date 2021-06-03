import React, { ReactElement, useEffect, useState } from 'react'
import styles from './SyncStatus.module.css'
import Button from '../atoms/Button'
import { useOcean } from '../../providers/Ocean'
import { BestPrice } from '@oceanprotocol/lib'
import { useWeb3 } from '../../providers/Web3'
import { useAsset } from '../../providers/Asset'

export default function TokenApproval({
  actionButton,
  disabled,
  amount
}: {
  actionButton: JSX.Element
  disabled: boolean
  amount: string
}): ReactElement {
  const { accountId } = useWeb3()
  const { ddo, owner } = useAsset()
  const [approveToken, setApproveToken] = useState(false)
  const [tokenApproved, setTokenApproved] = useState(false)
  const { ocean, config } = useOcean()

  useEffect(() => {
    ocean.datatokens
      .allowance(
        ddo.dataToken,
        owner,
        accountId // marketplace address,
      )
      .then((allowance) => {
        console.log(allowance)
        setTokenApproved(allowance !== '0')
      })
  }, [])

  async function approveTokens() {
    const tsx = await ocean.datatokens.approve(
      config.oceanTokenAddress,
      config.fixedRateExchangeAddress,
      amount,
      accountId
    )
    console.log(tsx)
  }

  console.log(tokenApproved)

  return (
    <div className={styles.sync}>
      {approveToken === false ? (
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
