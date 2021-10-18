import React, { ReactElement, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

import '@oceanprotocol/typographies/css/ocean-typo.css'
import './styles.css'

export default function StylesGlobal({
  children
}: {
  children: ReactNode
}): ReactElement {
  return (
    <>
      {children}
      <ToastContainer position="bottom-right" newestOnTop />
    </>
  )
}
