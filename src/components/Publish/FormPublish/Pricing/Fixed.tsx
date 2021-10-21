import React, { ReactElement } from 'react'
import FormHelp from '@shared/Form/Input/Help'
import Price from './Price'
import Fees from './Fees'

export default function Fixed({ content }: { content: any }): ReactElement {
  return (
    <>
      <FormHelp>{content.info}</FormHelp>
      <Price />
      <Fees tooltips={content.tooltips} pricingType="fixed" />
    </>
  )
}
