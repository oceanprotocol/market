import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { FormPublishData } from '../_types'
import { wizardSteps } from '../_constants'
import styles from './index.module.css'

export default function Navigation(): ReactElement {
  const {
    values,
    errors,
    touched,
    setFieldValue
  }: FormikContextType<FormPublishData> = useFormikContext()

  function handleStepClick(step: number) {
    setFieldValue('user.stepCurrent', step)
  }

  function getSuccessClass(step: number) {
    const isSuccessMetadata = errors.metadata === undefined
    const isSuccessServices = errors.services === undefined
    const isSuccessPricing =
      errors.pricing === undefined && touched.pricing?.price
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
