import React, { ReactElement, useEffect, useState } from 'react'
import rbacRequest from '../../utils/rbac'
import Alert from '../atoms/Alert'

export default function Permission({
  eventType,
  children
}: {
  eventType: string
  children: ReactElement
}): ReactElement {
  const [data, updateData] = useState<boolean>()
  useEffect(() => {
    const getData = async () => {
      const data = await rbacRequest(eventType)
      updateData(data)
    }
    getData()
  }, [eventType])
  console.log('eventType', eventType)
  if (data === false) {
    const message = `Sorry, you don't have permission to  ${eventType}. Please make sure you are logged in.`
    return <Alert title="Permission denied" text={message} state="error" />
  } else {
    return <>{children}</>
  }
}
