import React, { FormEvent, ReactElement } from 'react'
import { useOcean } from '@context/Ocean'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import { FormikContextType, useFormikContext } from 'formik'
import { FormPublishData } from '../_types'
import { wizardSteps } from '../_constants'

export default function Actions(): ReactElement {
  const { ocean, account } = useOcean()
  const {
    status,
    values,
    isValid,
    setFieldValue
  }: FormikContextType<FormPublishData> = useFormikContext()

  function handleNext(e: FormEvent) {
    e.preventDefault()
    setFieldValue('step', values.step + 1)
  }

  function handlePrevious(e: FormEvent) {
    e.preventDefault()
    setFieldValue('step', values.step - 1)
  }

  return (
    <footer className={styles.actions}>
      <Button onClick={handlePrevious}>Back</Button>

      {values.step < wizardSteps.length ? (
        <Button style="primary" onClick={handleNext}>
          Continue
        </Button>
      ) : (
        <Button
          type="submit"
          style="primary"
          disabled={!ocean || !account || !isValid}
        >
          Submit
        </Button>
      )}
    </footer>
  )
}
