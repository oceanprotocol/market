import React, { FormEvent, ReactElement, RefObject } from 'react'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import { FormikContextType, useFormikContext } from 'formik'
import { FormPublishData } from '../_types'
import { wizardSteps } from '../_constants'
import SuccessConfetti from '@shared/SuccessConfetti'

export default function Actions({
  scrollToRef,
  did
}: {
  scrollToRef: RefObject<any>
  did: string
}): ReactElement {
  const {
    values,
    errors,
    isValid,
    isSubmitting,
    setFieldValue
  }: FormikContextType<FormPublishData> = useFormikContext()

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

  const isContinueDisabled =
    (values.user.stepCurrent === 1 && errors.metadata !== undefined) ||
    (values.user.stepCurrent === 2 && errors.services !== undefined) ||
    (values.user.stepCurrent === 3 && errors.pricing !== undefined)

  return (
    <footer className={styles.actions}>
      {did ? (
        <SuccessConfetti
          success="Successfully published!"
          action={
            <Button style="primary" to={`/asset/${did}`}>
              View Asset
            </Button>
          }
        />
      ) : (
        <>
          {values.user.stepCurrent > 1 && (
            <Button onClick={handlePrevious} disabled={isSubmitting}>
              Back
            </Button>
          )}

          {values.user.stepCurrent < wizardSteps.length ? (
            <Button
              style="primary"
              onClick={handleNext}
              disabled={isContinueDisabled}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              style="primary"
              disabled={
                values.user.accountId === '' || !isValid || isSubmitting
              }
            >
              Submit
            </Button>
          )}
        </>
      )}
    </footer>
  )
}
