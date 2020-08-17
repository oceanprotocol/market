import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'

export default function Trade({ ddo }: { ddo: DDO }): ReactElement {
  const { ocean, accountId } = useOcean()
  const [finalTokens, setFinalTokens] = useState()

  const poolAddress = '0xunknown' // How to get this?

  useEffect(() => {
    async function init() {
      const finalTokens = await ocean.pool.getFinalTokens(
        accountId,
        poolAddress
      )
      setFinalTokens(finalTokens)
    }
    init()
  }, [])

  return <div>Final Tokens: {finalTokens}</div>
}
