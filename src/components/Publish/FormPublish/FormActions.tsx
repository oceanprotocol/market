import React, { ReactElement } from 'react'
import { useOcean } from '@context/Ocean'
import Button from '@shared/atoms/Button'
import styles from './FormActions.module.css'
import { FormikContextType, useFormikContext } from 'formik'
import { FormPublishData } from '../_types'

export default function FormActions({ step }: { step: number }): ReactElement {
  const { ocean, account } = useOcean()
  const { status, isValid, setFieldValue }: FormikContextType<FormPublishData> =
    useFormikContext()

  function handleNext() {
    setFieldValue('step', step + 1)
  }

  function handlePrevious() {
    setFieldValue('step', step - 1)
  }

  return (
    <footer className={styles.actions}>
      <Button onClick={handlePrevious}>Back</Button>

      <Button style="primary" onClick={() => handleNext()}>
        Continue
      </Button>

      {/* <Button
        type="submit"
        style="primary"
        disabled={!ocean || !account || !isValid}
      >
        Submit
      </Button> */}
    </footer>
  )
}
