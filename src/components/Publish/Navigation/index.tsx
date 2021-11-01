import { FormikContextType, useFormikContext } from 'formik'
import React, { FormEvent, ReactElement } from 'react'
import { FormPublishData } from '../_types'
import { wizardSteps } from '../_constants'
import styles from './index.module.css'

export default function Navigation(): ReactElement {
  const { values, setFieldValue }: FormikContextType<FormPublishData> =
    useFormikContext()

  function handleStepClick(step: number) {
    setFieldValue('step', step)
  }

  return (
    <nav className={styles.navigation}>
      <ol>
        {wizardSteps.map((step) => (
          <li
            key={step.title}
            onClick={() => handleStepClick(step.step)}
            className={values.step === step.step ? styles.current : null}
          >
            {step.title}
          </li>
        ))}
      </ol>
    </nav>
  )
}
