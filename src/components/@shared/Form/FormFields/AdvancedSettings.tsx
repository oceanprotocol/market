import React, { ReactElement, useState, FormEvent, ChangeEvent } from 'react'
import Input from '@shared/Form/Input'
import Button from '@shared/atoms/Button'
import { Field } from 'formik'
import styles from './AdvancedSettings.module.css'

export default function AdvancedSettings(prop: {
  content: FormStepContent
  handleFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldContent
  ) => void
}): ReactElement {
  const [showAdvancedSettings, setShowAdvancedSettings] =
    useState<boolean>(false)

  function toggleAdvancedSettings(e: FormEvent<Element>) {
    e.preventDefault()
    setShowAdvancedSettings(!!showAdvancedSettings)
  }
  return (
    <>
      <Button
        className={styles.advancedBtn}
        style="text"
        size="small"
        onClick={toggleAdvancedSettings}
      >
        Advanced Settings
      </Button>
      {showAdvancedSettings &&
        prop.content.fields.map(
          (field: FormFieldContent) =>
            field.advanced === true && (
              <Field
                key={field.name}
                {...field}
                options={field.options}
                component={Input}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  prop.handleFieldChange(e, field)
                }
              />
            )
        )}
    </>
  )
}
