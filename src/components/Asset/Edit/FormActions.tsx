import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'

export default function FormActions({
  setShowEdit,
  handleClick
}: {
  setShowEdit: (show: boolean) => void
  handleClick?: () => void
}): ReactElement {
  const { isAssetNetwork } = useAsset()
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
      <Button style="text" onClick={() => setShowEdit(false)}>
        Cancel
      </Button>
    </footer>
  )
}
