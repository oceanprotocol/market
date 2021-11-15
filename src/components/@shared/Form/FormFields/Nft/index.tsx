import { InputProps } from '@shared/Form/Input'
import { generateNftOptions } from '@utils/nft'
import { useField } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import styles from './index.module.css'

export default function Nft(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  // Generate on first mount
  useEffect(() => {
    if (field.value?.name !== '') return

    const nftOptions = generateNftOptions()
    helpers.setValue({ ...nftOptions })
  }, [field.value?.name])

  return (
    <div className={styles.nft}>
      <img
        src="//placekitten.com/g/128/128"
        className={styles.image}
        width="128"
        height="128"
      />
      <div className={styles.token}>
        <strong>{field?.value?.name}</strong> —{' '}
        <strong>{field?.value?.symbol}</strong>
      </div>
    </div>
  )
}
