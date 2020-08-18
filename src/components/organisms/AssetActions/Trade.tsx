import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'

interface Balance {
  ocean: string
  dt: string
}

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const { getBestPool } = useMetadata()
  const [numTokens, setNumTokens] = useState()
  const [balance, setBalance] = useState<Balance>()
  const [sharesBalance, setSharesBalance] = useState()

  useEffect(() => {
    async function init() {
      try {
        const { poolAddress, poolPrice } = await getBestPool(ddo.dataToken)

        const numTokens = await ocean.pool.getNumTokens(accountId, poolAddress)
        setNumTokens(numTokens)

        const oceanReserve = await ocean.pool.getOceanReserve(
          accountId,
          poolAddress
        )
        const dtReserve = await ocean.pool.getDTReserve(accountId, poolAddress)
        setBalance({
          ocean: oceanReserve,
          dt: dtReserve
        })

        const sharesBalance = await ocean.pool.sharesBalance(
          accountId,
          poolAddress
        )
        setSharesBalance(sharesBalance)
      } catch (error) {
        console.error(error.message)
      }
    }
    init()
  }, [])

  return (
    <>
      <div>
        Num Tokens: <br />
        {numTokens}
      </div>
      <div>
        Reserve: <br />
        {balance && (
          <>
            OCEAN {balance.ocean}
            <br />
            DT {balance.dt}
          </>
        )}
      </div>
      <div>
        Shares Balance: <br />
        {sharesBalance}
      </div>
    </>
  )
}
