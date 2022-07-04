import React, { ReactElement } from 'react'
import { Field, Form } from 'formik'
import Input, { InputProps } from '@shared/FormInput'
import FormActions from './FormActions'
import { useAsset } from '@context/Asset'

export function checkIfTimeoutInPredefinedValues(
  timeout: string,
  timeoutOptions: string[]
): boolean {
  if (timeoutOptions.indexOf(timeout) > -1) {
    return true
  }
  return false
}

export default function FormEditMetadata({
  data,
  showPrice,
  isComputeDataset
}: {
  data: InputProps[]
  showPrice: boolean
  isComputeDataset: boolean
}): ReactElement {
  const { oceanConfig } = useAsset()

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
      {data.map(
        (field: InputProps) =>
          (!showPrice && field.name === 'price') || (
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
          )
      )}

      <FormActions />
    </Form>
  )
}
