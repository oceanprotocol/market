import React, { ReactElement } from 'react'
import FormHelp from '@shared/FormInput/Help'
import Price from './Price'
import styles from './Dynamic.module.css'

export default function Free({ content }: { content: any }): ReactElement {
  return (
    <>
      <FormHelp>{content.info}</FormHelp>
      <h4 className={styles.title}>Price</h4>
      <Price />
    </>
  )
}
