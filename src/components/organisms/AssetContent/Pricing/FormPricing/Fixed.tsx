import React, { ReactElement } from 'react'
import FormHelp from '../../../../atoms/Input/Help'
import { DDO } from '@oceanprotocol/lib'
import Price from './Price'
import { help } from './index.module.css'
import { fixed } from './Fixed.module.css'

export default function Fixed({
  ddo,
  content
}: {
  ddo: DDO
  content: any
}): ReactElement {
  return (
    <div className={fixed}>
      <FormHelp className={help}>{content.info}</FormHelp>
      <Price ddo={ddo} />
    </div>
  )
}
