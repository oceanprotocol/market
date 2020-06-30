import React, { ReactElement, ReactNode } from 'react'

import '../global/styles.css'

export default function Styles({
  children
}: {
  children: ReactNode
}): ReactElement {
  return <>{children}</>
}
