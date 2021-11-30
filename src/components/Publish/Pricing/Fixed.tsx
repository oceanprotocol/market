import React, { ReactElement } from 'react'
import FormHelp from '@shared/FormInput/Help'
import Price from './Price'
import Fees from './Fees'
import styles from './Dynamic.module.css'

export default function Fixed({ content }: { content: any }): ReactElement {
  return (
    <>
      <FormHelp>{content.info}</FormHelp>

      <h4 className={styles.title}>Price</h4>

      <Price />
      <Fees tooltips={content.tooltips} pricingType="fixed" />
    </>
  )
}
