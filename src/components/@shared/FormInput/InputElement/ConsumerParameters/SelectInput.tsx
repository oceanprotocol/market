import React, { ReactElement } from 'react'
import { InputProps } from '../..'
import { ErrorMessage, useField, useFormikContext } from 'formik'
import { ConsumerParameter, FormPublishData } from '@components/Publish/_types'
import InputOptions from './InputOptions'
import styles from './SelectInput.module.css'
import { getObjectPropertyByPath } from '@utils/index'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function SelectInput({
  index,
  inputName,
  ...props
}: InputProps & {
  index: number
  inputName: string
}): ReactElement {
  const { errors, touched } = useFormikContext<FormPublishData>()
  const [field] = useField<ConsumerParameter[]>(inputName)

  const showError = (name: string, index: number): boolean =>
    [errors, touched].every(
      (object) =>
        !!getObjectPropertyByPath(object, `${field.name}[${index}].${name}`)
    )

  return (
    <div
      className={cx({
        optionsContainer: true,
        hasError: showError('options', index)
      })}
    >
      <InputOptions
        {...props}
        name={field.name}
        label="Options"
        required
        optionIndex={index}
        defaultOptions={
          field.value[index]?.options as {
            [key: string]: string
          }[]
        }
      />
      {showError('options', index) && (
        <div className={styles.error}>
          <ErrorMessage name={`${field.name}[${index}].options`} />
        </div>
      )}
    </div>
  )
}
