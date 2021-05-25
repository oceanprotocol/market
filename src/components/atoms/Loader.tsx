import React, { ReactElement } from 'react'
import {
  loaderWrap,
  loader,
  message as messageStyle
} from './Loader.module.css'

export default function Loader({
  message
}: {
  message?: string
}): ReactElement {
  return (
    <div className={loaderWrap}>
      <span className={loader} />
      {message && <span className={messageStyle}>{message}</span>}
    </div>
  )
}
