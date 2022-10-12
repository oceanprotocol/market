import Button from '@shared/atoms/Button'
import { InputProps } from '@shared/FormInput'
import { generateNftMetadata } from '@utils/nft'
import { useField } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import Refresh from '@images/refresh.svg'
import styles from './index.module.css'

export default function Nft(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  const refreshNftMetadata = () => {
    const nftMetadata = generateNftMetadata()
    helpers.setValue({ ...nftMetadata })
  }

  // Generate on first mount
  useEffect(() => {
    if (field.value?.name !== '') return

    refreshNftMetadata()
  }, [field.value?.name])

  return (
    <div className={styles.nft}>
      <figure className={styles.image}>
        <img src={field?.value?.image_data} width="128" height="128" />
        <div className={styles.actions}>
          <Button
            style="text"
            size="small"
            className={styles.refresh}
            title="Generate new image"
            onClick={(e) => {
              e.preventDefault()
              refreshNftMetadata()
            }}
          >
            <Refresh />
          </Button>
        </div>
      </figure>

      <div className={styles.token}>
        <strong>{field?.value?.name}</strong> —{' '}
        <strong>{field?.value?.symbol}</strong>
        <br />
        {field?.value?.description}
      </div>
    </div>
  )
}
