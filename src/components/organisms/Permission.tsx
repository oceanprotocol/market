import React, { ReactElement, useEffect, useState } from 'react'
import rbacRequest from '../../utils/rbac'

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
      const data = await rbacRequest('browse')
      updateData(data)
    }
    getData()
  }, [])

  if (data === false) {
    return <b>Sorry you do not have permission to {eventType}</b>
  } else {
    return <>{children}</>
  }
}
