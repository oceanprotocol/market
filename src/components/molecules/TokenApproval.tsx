import React, { ReactElement, useEffect, useState } from 'react'
import styles from './SyncStatus.module.css'
import Button from '../atoms/Button'
import { useOcean } from '../../providers/Ocean'
import { BestPrice } from '@oceanprotocol/lib'
import { useWeb3 } from '../../providers/Web3'
import { useAsset } from '../../providers/Asset'

export default function TokenApproval({
  actionButton,
  price
}: {
  actionButton: JSX.Element
  price: BestPrice
}): ReactElement {
  const { accountId } = useWeb3()
  const { ddo, owner } = useAsset()
  const [approveToken, setApproveToken] = useState(false)
  const [tokenApproved, setTokenApproved] = useState(false)
  const { ocean } = useOcean()

  console.log(approveToken)

  useEffect(() => {
    ocean.datatokens
      .allowance(
        ddo.dataToken,
        owner,
        accountId // marketplace address,
      )
      .then((allowance) => {
        console.log(allowance !== '0')
        setTokenApproved(allowance !== '0')
      })
  }, [])

  // ocean.datatokens.approve(

  return (
    <div className={styles.sync}>
      {approveToken === false ? (
        <>
          {actionButton}
          {tokenApproved || (
            <Button
              style="primary"
              size="small"
              onClick={() => {
                setApproveToken(true)
              }}
              disabled={false}
            >
              Approve TOKEN
            </Button>
          )}
        </>
      ) : (
        <>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              setApproveToken(false)
            }}
            disabled={false}
          >
            {price.datatoken} TOKEN
          </Button>
          <Button
            style="primary"
            size="small"
            onClick={() => {
              setApproveToken(false)
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
