import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { useAsset } from '@context/Asset'
import { useOcean } from '@context/Ocean'
import { useWeb3 } from '@context/Web3'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'

export default function FormActions({
  setShowEdit,
  handleClick
}: {
  setShowEdit: (show: boolean) => void
  handleClick?: () => void
}): ReactElement {
  const { accountId } = useWeb3()
  const { ocean } = useOcean()
  const { isAssetNetwork } = useAsset()
  const { isValid }: FormikContextType<Partial<any>> = useFormikContext()

  return (
    <footer className={styles.actions}>
      <Button
        style="primary"
        disabled={!ocean || !accountId || !isValid || !isAssetNetwork}
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
