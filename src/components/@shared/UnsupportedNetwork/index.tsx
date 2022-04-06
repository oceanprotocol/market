import React, { ReactElement } from 'react'
import Alert from '@shared/atoms/Alert'

export default function PagePublish(): ReactElement {
  return (
    <>
      <Alert text="You are on an unsuported network" state="error" />
    </>
  )
}
