import React, { ReactElement } from 'react'
import { FormPublishData } from '@components/Publish/_types'
import classNames from 'classnames/bind'
import { ErrorMessage, Field, useFormikContext } from 'formik'
import { getObjectPropertyByPath } from '@utils/index'
import InputKeyValue, { KeyValueInputProps } from '../KeyValueInput'
import styles from './OptionsInput.module.css'

const cx = classNames.bind(styles)

export default function OptionsInput(props: KeyValueInputProps): ReactElement {
  const { errors, touched } = useFormikContext<FormPublishData>()

  const hasError = (): boolean =>
    [errors, touched].every(
      (object) => !!getObjectPropertyByPath(object, props.name)
    )

  return (
    <div className={cx({ container: true, hasError: hasError() })}>
      <Field
        {...props}
        component={InputKeyValue}
        uniqueKeys
        keyPlaceholder="value"
        valuePlaceholder="label"
      />

      {hasError() && (
        <div className={styles.error}>
          <ErrorMessage name={props.name} />
        </div>
      )}
    </div>
  )
}
