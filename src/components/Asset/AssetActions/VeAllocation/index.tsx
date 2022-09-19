import { VeAllocate } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect } from 'react'

export default function VeAllocation(): ReactElement {
  useEffect(() => {
    const veAllocation = new VeAllocate()
  }, [])

  return <div>Ve Allocation</div>
}
