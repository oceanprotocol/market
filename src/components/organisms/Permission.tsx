import React, { ReactElement, useEffect, useState } from 'react'
import { useWeb3 } from '../../providers/Web3'
import rbacRequest from '../../utils/rbac'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'
import appConfig from '../../../app.config'

export default function Permission({
  eventType,
  children
}: {
  eventType: string
  children: ReactElement
}): ReactElement {
  const url = appConfig.rbacUrl
  const [data, updateData] = useState<boolean>()
  const { accountId } = useWeb3()
  useEffect(() => {
    if (url === undefined) return
    const getData = async () => {
      if (accountId !== undefined) {
        const data = await rbacRequest(eventType, accountId)
        updateData(data)
      }
    }
    getData()
  }, [eventType, accountId, url])
  if (url === undefined || data === true) {
    return <>{children}</>
  } else if (data === false) {
    const message = `Sorry, you don't have permission to  ${eventType}. Please make sure you have connected your registered address.`
    return <Alert title="Permission denied" text={message} state="error" />
  } else {
    return (
      <>
        <Alert
          text="Please make sure your wallet is connected to proceed."
          state="info"
        />
        <br />
        <Loader />
      </>
    )
  }
}
