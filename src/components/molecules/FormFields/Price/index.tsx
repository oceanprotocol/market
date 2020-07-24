import React, { ReactElement } from 'react'
import { InputProps } from '../../../atoms/Input'
import InputElement from '../../../atoms/Input/InputElement'
import styles from './index.module.css'
import Label from '../../../atoms/Input/Label'
import { useFormikContext } from 'formik'
import { MetadataPublishForm } from '../../../../@types/MetaData'
import Tabs from '../../../atoms/Tabs'
import FormHelp from '../../../atoms/Input/Help'
import Conversion from '../../../atoms/Price/Conversion'

export default function Price(props: InputProps): ReactElement {
  const { values } = useFormikContext()

  const Simple = (
    <div className={styles.content}>
      <div className={styles.simpleInput}>
        {/* <Label htmlFor="price.cost">Cost</Label> */}
        <div className={styles.prefix}>OCEAN</div>
        <InputElement
          {...props.field}
          value={
            ((values as MetadataPublishForm).price &&
              (values as MetadataPublishForm).price.cost) ||
            0
          }
          name="price.cost"
          type="number"
        />
        <Conversion
          price={(values as MetadataPublishForm).price.cost.toString()}
        />
      </div>
      <FormHelp>{props.help}</FormHelp>
    </div>
  )

  const Advanced = (
    <div className={`${styles.content} ${styles.advancedInput}`}>
      <div>
        <Label htmlFor="price.cost">Cost</Label>
        <InputElement
          {...props.field}
          value={
            (values as MetadataPublishForm).price &&
            ((values as MetadataPublishForm).price.cost || 1)
          }
          name="price.cost"
          type="number"
        />
      </div>
      <div>
        <Label htmlFor="price.tokensToMint">Tokens to Mint</Label>
        <InputElement
          {...props.field}
          value={
            (values as MetadataPublishForm).price &&
            ((values as MetadataPublishForm).price.tokensToMint || 1)
          }
          name="price.tokensToMint"
          type="number"
        />
      </div>
    </div>
  )

  const tabs = [
    {
      title: 'Simple',
      content: Simple
    },
    {
      title: 'Advanced',
      content: Advanced
    }
  ]

  return (
    <div className={styles.price}>
      <Tabs items={tabs} />
    </div>
  )
}
