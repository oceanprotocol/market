import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FormPublishData } from '../_types'
import { wizardSteps } from '../_constants'
import styles from './index.module.css'

export default function Navigation(): ReactElement {
  const router = useRouter()

  const {
    values,
    errors,
    touched,
    setFieldValue
  }: FormikContextType<FormPublishData> = useFormikContext()

  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const step = parseInt(urlParams.get('step'))

  useEffect(() => {
    // Change route to include steps
    router.push(
      `${router.pathname}/?step=${values.user.stepCurrent}`,
      undefined,
      {
        shallow: true
      }
    )
  }, [values.user.stepCurrent])

  function handleStepClick(step: number) {
    setFieldValue('user.stepCurrent', step)
  }

  useEffect(() => {
    // load current step on refresh - CAUTION: all data will be deleted anyway
    setFieldValue('user.stepCurrent', step)
  }, [])

  useEffect(() => {
    const { query } = router
    if (query?.step === 1) return
    console.log(query)
    const currentStep = parseInt(query.step)
    console.log(currentStep)
    handleStepClick(currentStep)
  }, [router])

  function getSuccessClass(step: number) {
    const isSuccessMetadata = errors.metadata === undefined
    const isSuccessServices = errors.services === undefined
    const isSuccessPricing =
      errors.pricing === undefined &&
      (touched.pricing?.price || touched.pricing?.freeAgreement)
    const isSuccessPreview =
      isSuccessMetadata && isSuccessServices && isSuccessPricing

    const isSuccess =
      (step === 1 && isSuccessMetadata) ||
      (step === 2 && isSuccessServices) ||
      (step === 3 && isSuccessPricing) ||
      (step === 4 && isSuccessPreview)

    return isSuccess ? styles.success : null
  }

  return (
    <nav className={styles.navigation}>
      <ol>
        {wizardSteps.map((step) => (
          <li
            key={step.title}
            onClick={() => handleStepClick(step.step)}
            className={`${
              values.user.stepCurrent === step.step ? styles.current : null
            } ${getSuccessClass(step.step)}`}
          >
            {step.title}
          </li>
        ))}
      </ol>
    </nav>
  )
}
