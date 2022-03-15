import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'
import { useRouter } from 'next/router'

export default function FormActions({
  handleClick
}: {
  handleClick?: () => void
}): ReactElement {
  const { isAssetNetwork, asset } = useAsset()
  const router = useRouter()
  const { did } = router.query
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
      <Button
        style="text"
        onClick={() => {
          router.push(`/asset/${did}`)
        }}
      >
        Cancel
      </Button>
    </footer>
  )
}
