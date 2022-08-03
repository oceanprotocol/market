import React, { ReactElement } from 'react'
import FormHelp from '@shared/FormInput/Help'
import Price from './Price'
import Fees from './Fees'
import styles from './Fixed.module.css'

export default function Fixed({
  approvedBaseTokens,
  content
}: {
  approvedBaseTokens: TokenInfo[]
  content: any
}): ReactElement {
  return (
    <>
      <FormHelp>{content.info}</FormHelp>

      <h4 className={styles.title}>Price</h4>

      <Price approvedBaseTokens={approvedBaseTokens} />
      <Fees tooltips={content.tooltips} />
    </>
  )
}
