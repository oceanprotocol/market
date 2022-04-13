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
  let step = parseInt(urlParams.get('step'))
  // check if exists and it's valid, if not, restart flow
  if (!step || step > 5) {
    step = 1
  }

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

  // used window object, as catching the state of the router with useRouter() causes side effects
  window.onpopstate = function () {
    setFieldValue('user.stepCurrent', step)
  }

  useEffect(() => {
    // load current step on refresh - CAUTION: all data will be deleted anyway
    setFieldValue('user.stepCurrent', step || 1)
  }, [])

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
