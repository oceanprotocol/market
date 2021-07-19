import React, { ReactElement, useState, FormEvent, ChangeEvent } from 'react'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { FormContent, FormFieldProps } from '../../../@types/Form'
import { Field } from 'formik'
import appConfig from '../../../../app.config'
import styles from './advancedSettings.module.css'
import { IntrinsicElements } from 'react-markdown/src/ast-to-react'

export default function AdvancedSettings(prop: {
  content: FormContent
  handleFieldChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: FormFieldProps
  ) => void
}): ReactElement {
  const [advancedSettings, setAdvancedSettings] = useState<boolean>(false)

  function toggleAdvancedSettings(e: FormEvent<Element>) {
    e.preventDefault()
    advancedSettings === true
      ? setAdvancedSettings(false)
      : setAdvancedSettings(true)
    console.log('advancedSettings', advancedSettings)
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
      {prop.content.data.map(
        (field: FormFieldProps) =>
          advancedSettings === true &&
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
