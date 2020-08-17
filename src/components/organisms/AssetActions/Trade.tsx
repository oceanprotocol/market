import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const [finalTokens, setFinalTokens] = useState()
  const [currentTokens, setCurrentTokens] = useState<string[]>()
  const [numTokens, setNumTokens] = useState()

  const poolAddress = '0xunknown' // How to get this?

  useEffect(() => {
    async function init() {
      try {
        const numTokens = await ocean.pool.getNumTokens(accountId, poolAddress)
        setNumTokens(numTokens)

        const currentTokens = await ocean.pool.getCurrentTokens(
          accountId,
          poolAddress
        )
        setCurrentTokens(currentTokens)

        const finalTokens = await ocean.pool.getFinalTokens(
          accountId,
          poolAddress
        )
        setFinalTokens(finalTokens)
      } catch (error) {
        console.error(error.message)
      }
    }
    init()
  }, [])

  return (
    <>
      <div>Num Tokens: {numTokens}</div>
      <div>Current Tokens: {currentTokens}</div>
      <div>Final Tokens: {finalTokens}</div>
    </>
  )
}
