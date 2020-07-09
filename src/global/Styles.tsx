import React, { ReactElement, ReactNode } from 'react'

import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../global/styles.css'

export default function Styles({
  children
}: {
  children: ReactNode
}): ReactElement {
  return <>{children}</>
}
