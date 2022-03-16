import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'
import Link from 'next/link'

export default function FormActions({
  handleClick
}: {
  handleClick?: () => void
}): ReactElement {
  const { isAssetNetwork, asset } = useAsset()
  const { isValid }: FormikContextType<Partial<any>> = useFormikContext()

  return (
    <footer className={styles.actions}>
      <Button
        style="primary"
        disabled={!isValid || !isAssetNetwork}
        onClick={handleClick}
      >
        Submit
      </Button>
      <Link href={`/asset/${asset?.id}`} key={asset?.id}>
        Cancel
      </Link>
    </footer>
  )
}
