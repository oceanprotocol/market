import React, { ReactElement } from 'react'
import { Field, Form } from 'formik'
import Input, { InputProps } from '@shared/FormInput'
import FormActions from './FormActions'
import { useAsset } from '@context/Asset'
import styles from './FormEditMetadata.module.css'

export function checkIfTimeoutInPredefinedValues(
  timeout: string,
  timeoutOptions: string[]
): boolean {
  if (timeoutOptions.indexOf(timeout) > -1) {
    return true
  }
  return false
}

export interface FormEditMetadataValues {
  author: string
  description: string
  files: string
  links: string
  name: string
  price: string
  timeout: string
}

export default function FormEditMetadata({
  data,
  showPrice,
  isComputeDataset,
  initialValues,
  currentValues
}: {
  data: InputProps[]
  showPrice: boolean
  isComputeDataset: boolean
  initialValues: FormEditMetadataValues
  currentValues: FormEditMetadataValues
}): ReactElement {
  const { oceanConfig } = useAsset()

  // get diff between initial value and current value to get inputs changed
  // we'll add an outline when an input has changed
  const getDifference = (a: any, b: any) =>
    Object.entries(a).reduce(
      (ac: any, [k, v]) => (b[k] && b[k] !== v ? ((ac[k] = b[k]), ac) : ac),
      {}
    )

  const diff = getDifference(initialValues, currentValues)

  // This component is handled by Formik so it's not rendered like a "normal" react component,
  // so handleTimeoutCustomOption is called only once.
  // https://github.com/oceanprotocol/market/pull/324#discussion_r561132310
  // if (data && values) handleTimeoutCustomOption(data, values)

  const timeoutOptionsArray = data.filter(
    (field) => field.name === 'timeout'
  )[0].options

  if (isComputeDataset && timeoutOptionsArray.includes('Forever')) {
    const foreverOptionIndex = timeoutOptionsArray.indexOf('Forever')
    timeoutOptionsArray.splice(foreverOptionIndex, 1)
  } else if (!isComputeDataset && !timeoutOptionsArray.includes('Forever')) {
    timeoutOptionsArray.push('Forever')
  }

  return (
    <Form>
      {data.map((field: InputProps) => {
        const fieldHasChanged = Object.keys(diff).includes(field.name)
        return (
          (!showPrice && field.name === 'price') || (
            <span className={fieldHasChanged ? styles.inputChanged : null}>
              <Field
                key={field.name}
                options={
                  field.name === 'timeout' && isComputeDataset === true
                    ? timeoutOptionsArray
                    : field.options
                }
                {...field}
                component={Input}
                prefix={field.name === 'price' && oceanConfig?.oceanTokenSymbol}
              />
            </span>
          )
        )
      })}

      <FormActions />
    </Form>
  )
}
