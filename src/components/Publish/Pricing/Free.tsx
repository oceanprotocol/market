import React, { ReactElement } from 'react'
import FormHelp from '@shared/FormInput/Help'
import Price from './Price'

export default function Free({ content }: { content: any }): ReactElement {
  return (
    <>
      <FormHelp>{content.info}</FormHelp>
      <Price free />
    </>
  )
}
