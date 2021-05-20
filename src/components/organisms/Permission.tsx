import React, { ReactElement, useEffect, useState } from 'react'
import rbacRequest from '../../utils/rbac'

export default function Permission({
  eventType
}: {
  eventType: string
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
    return <div>Sorry you do not have permission to {eventType}</div>
  } else {
    return <div>permission</div>
  }
}
