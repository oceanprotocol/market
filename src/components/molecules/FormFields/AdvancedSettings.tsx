import React, { ReactElement, useState, FormEvent, ChangeEvent } from 'react'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { Field } from 'formik'
import styles from './AdvancedSettings.module.css'

export default function AdvancedSettings(prop: {
  content: FormContent
  handleFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) => void
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false)
  function toggleAdvancedSettings(e: FormEvent<Element>) {
    e.preventDefault()
    advancedSettings === true
      ? setAdvancedSettings(false)
      : setAdvancedSettings(true)
  }
  return (
    <>
      {appConfig.allowAdvancedPublishSettings === 'true' && (
        <Button
          className={styles.advancedBtn}
          style="text"
          size="small"
          onClick={toggleAdvancedSettings}
        >
          Advanced Settings
        </Button>
      )}
      {advancedSettings === true &&
        prop.content.data.map(
          (field: FormFieldProps) =>
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
