import { FormikContextType, useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { FormPublishData } from '../_types'
import { wizardSteps } from '../_constants'
import styles from './index.module.css'

export default function Navigation(): ReactElement {
  const { values, errors, setFieldValue }: FormikContextType<FormPublishData> =
    useFormikContext()

  function handleStepClick(step: number) {
    setFieldValue('user.stepCurrent', step)
  }

  const isSuccessMetadata = errors.metadata === undefined
  const isSuccessServices = errors.services === undefined

  console.log(errors.services)

  return (
    <nav className={styles.navigation}>
      <ol>
        {wizardSteps.map((step) => (
          <li
            key={step.title}
            onClick={() => handleStepClick(step.step)}
            // TODO: add success class for all steps
            className={`${
              values.user.stepCurrent === step.step ? styles.current : null
            } ${step.step === 1 && isSuccessMetadata ? styles.success : null} ${
              step.step === 2 && isSuccessServices ? styles.success : null
            }`}
          >
            {step.title}
          </li>
        ))}
      </ol>
    </nav>
  )
}
