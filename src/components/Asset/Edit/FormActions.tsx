import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'
import Link from 'next/link'
import { ComputeEditForm, MetadataEditForm } from './_types'

export default function FormActions({
  handleClick
}: {
  handleClick?: () => void
}): ReactElement {
  const { isAssetNetwork, asset } = useAsset()
  const { isValid }: FormikContextType<MetadataEditForm | ComputeEditForm> =
    useFormikContext()

  const isSubmitDisabled = !isValid || !isAssetNetwork

  return (
    <footer className={styles.actions}>
      <Button style="primary" disabled={isSubmitDisabled} onClick={handleClick}>
        Submit
      </Button>
      <Link href={`/asset/${asset?.id}`} key={asset?.id}>
        Cancel
      </Link>
    </footer>
  )
}
