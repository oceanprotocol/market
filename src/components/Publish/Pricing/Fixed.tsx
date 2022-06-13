import React, { ReactElement } from 'react'
import FormHelp from '@shared/FormInput/Help'
import Price from './Price'
import Fees from './Fees'
import styles from './Dynamic.module.css'
import BaseToken from './BaseToken'
import Tooltip from '@shared/atoms/Tooltip'

export default function Fixed({
  content,
  defaultBaseToken
}: {
  content: any
  defaultBaseToken: TokenInfo
}): ReactElement {
  return (
    <>
      <FormHelp>{content.info}</FormHelp>

      <h4 className={styles.title}>
        Base Token <Tooltip content={content.tooltips.baseToken} />
      </h4>
      <BaseToken defaultBaseToken={defaultBaseToken} />

      <h4 className={styles.title}>Price</h4>
      <Price />
      <Fees tooltips={content.tooltips} pricingType="fixed" />
    </>
  )
}
