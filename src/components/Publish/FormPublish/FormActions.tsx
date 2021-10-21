import React, { FormEvent, ReactElement } from 'react'
import { useOcean } from '@context/Ocean'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'
import { FormikContextType, useFormikContext } from 'formik'
import { FormPublishData } from '../_types'

export default function FormActions({
  isValid,
  resetFormAndClearStorage
}: {
  isValid: boolean
  resetFormAndClearStorage: (e: FormEvent<Element>) => void
}): ReactElement {
  const { ocean, account } = useOcean()
  const { status }: FormikContextType<FormPublishData> = useFormikContext()

  return (
    <footer className={styles.actions}>
      {status !== 'empty' && (
        <Button style="text" size="small" onClick={resetFormAndClearStorage}>
          Reset Form
        </Button>
      )}

      <Button
        style="primary"
        disabled={!ocean || !account || !isValid || status === 'empty'}
      >
        Submit
      </Button>
    </footer>
  )
}
