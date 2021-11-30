import React, { FormEvent, ReactElement, RefObject } from 'react'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import { FormikContextType, useFormikContext } from 'formik'
import { FormPublishData } from '../_types'
import { wizardSteps } from '../_constants'

export default function Actions({
  scrollToRef
}: {
  scrollToRef: RefObject<any>
}): ReactElement {
  const { values, isValid, setFieldValue }: FormikContextType<FormPublishData> =
    useFormikContext()

  function handleNext(e: FormEvent) {
    e.preventDefault()
    setFieldValue('user.stepCurrent', values.user.stepCurrent + 1)
    scrollToRef.current.scrollIntoView()
  }

  function handlePrevious(e: FormEvent) {
    e.preventDefault()
    setFieldValue('user.stepCurrent', values.user.stepCurrent - 1)
    scrollToRef.current.scrollIntoView()
  }

  return (
    <footer className={styles.actions}>
      {values.user.stepCurrent > 1 && (
        <Button onClick={handlePrevious}>Back</Button>
      )}

      {values.user.stepCurrent < wizardSteps.length ? (
        <Button style="primary" onClick={handleNext}>
          Continue
        </Button>
      ) : (
        <Button
          type="submit"
          style="primary"
          disabled={values.user.accountId === '' || !isValid}
        >
          Submit
        </Button>
      )}
    </footer>
  )
}
