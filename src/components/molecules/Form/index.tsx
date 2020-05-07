import React from 'react'
import FormJsonSchema, {
  UiSchema,
  IChangeEvent,
  ISubmitEvent,
  ErrorSchema,
  AjvError
} from 'react-jsonschema-form'
import { JSONSchema6 } from 'json-schema'
import Button from '../../atoms/Button'
import styles from './index.module.css'

import { FieldTemplate } from './FieldTemplate'

import {
  customWidgets,
  PublishFormDataInterface
} from '../../../models/PublishForm'
// Overwrite default input fields
/* 
AltDateTimeWidget
AltDateWidget
CheckboxWidget
ColorWidget
DateTimeWidget
DateWidget
EmailWidget
FileWidget
HiddenWidget
RadioWidget
RangeWidget
SelectWidget
CheckboxesWidget
UpDownWidget
TextareaWidget
PasswordWidget
TextWidget
URLWidget
*/

// Example of Custom Error
// REF: react-jsonschema-form.readthedocs.io/en/latest/validation/#custom-error-messages
export const transformErrors = (errors: AjvError[]) => {
  return errors.map((error: AjvError) => {
    if (error.property === '.termsAndConditions') {
      console.log('ERROR')
      error.message = 'Required Field'
    }
    return error
  })
}

const validate = (formData: PublishFormDataInterface, errors: any) => {
  if (!formData.termsAndConditions) {
    errors.termsAndConditions.addError('Required Field')
  }
  return errors
}

export declare type FormProps = {
  buttonDisabled?: boolean
  children?: React.ReactNode
  schema: JSONSchema6
  uiSchema: UiSchema
  formData: PublishFormDataInterface
  onChange: (
    e: IChangeEvent<PublishFormDataInterface>,
    es?: ErrorSchema
  ) => void
  onSubmit: (e: ISubmitEvent<PublishFormDataInterface>) => void
  onError: (e: AjvError) => void
  showErrorList?: boolean
}

export default function Form({
  children,
  schema,
  uiSchema,
  formData,
  onChange,
  onSubmit,
  onError,
  showErrorList,
  buttonDisabled
}: FormProps) {
  return (
    <FormJsonSchema
      className={styles.form}
      schema={schema}
      formData={formData}
      uiSchema={uiSchema}
      onChange={(event: IChangeEvent<PublishFormDataInterface>) =>
        onChange(event)
      }
      onSubmit={(event: ISubmitEvent<PublishFormDataInterface>) =>
        onSubmit(event)
      }
      FieldTemplate={FieldTemplate}
      onError={onError}
      widgets={customWidgets}
      noHtml5Validate
      showErrorList={showErrorList}
      validate={validate} // REF: https://react-jsonschema-form.readthedocs.io/en/latest/validation/#custom-validation
      // liveValidate
      transformErrors={transformErrors}
    >
      <div>
        <Button disabled={buttonDisabled} primary>
          Submit
        </Button>
      </div>
      {children}
    </FormJsonSchema>
  )
}
