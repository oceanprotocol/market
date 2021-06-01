import React, { ReactElement, useEffect, useState } from 'react'
import { useWeb3 } from '../../providers/Web3'
import rbacRequest from '../../utils/rbac'
import Alert from '../atoms/Alert'
import Loader from '../atoms/Loader'

export default function Permission({
  eventType,
  children
}: {
  eventType: string
  children: ReactElement
}): ReactElement {
  const [data, updateData] = useState<boolean>()
  const { accountId } = useWeb3()
  useEffect(() => {
    const getData = async () => {
      const data = await rbacRequest(eventType, accountId)
      updateData(data)
    }
    getData()
  }, [eventType, accountId])
  console.log('eventType', eventType)
  if (data === true) {
    return <>{children}</>
  } else if (data === false) {
    const message = `Sorry, you don't have permission to  ${eventType}. Please make sure you are logged in.`
    return <Alert title="Permission denied" text={message} state="error" />
  } else {
    return <Loader />
  }
}
