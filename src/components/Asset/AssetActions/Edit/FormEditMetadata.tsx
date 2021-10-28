import React, { ChangeEvent, ReactElement } from 'react'
import { Field, Form, FormikContextType, useFormikContext } from 'formik'
import { useOcean } from '@context/Ocean'
import Input, { InputProps } from '@shared/Form/Input'
import { checkIfTimeoutInPredefinedValues } from '@utils/ddo'
import FormActions from './FormActions'
import styles from './FormEditMetadata.module.css'
import { FormPublishData } from '../../../Publish/_types'

// function handleTimeoutCustomOption(
//   data: FormFieldContent[],
//   values: Partial<FormPublishData>
// ) {
//   const timeoutFieldContent = data.filter(
//     (field) => field.name === 'timeout'
//   )[0]
//   const timeoutInputIndex = data.findIndex(
//     (element) => element.name === 'timeout'
//   )
//   if (
//     data[timeoutInputIndex].options.length < 6 &&
//     !checkIfTimeoutInPredefinedValues(
//       values.timeout,
//       timeoutFieldContent.options
//     )
//   ) {
//     data[timeoutInputIndex].options.push(values.timeout)
//   } else if (
//     data[timeoutInputIndex].options.length === 6 &&
//     checkIfTimeoutInPredefinedValues(
//       values.timeout,
//       timeoutFieldContent.options
//     )
//   ) {
//     data[timeoutInputIndex].options.pop()
//   } else if (
//     data[timeoutInputIndex].options.length === 6 &&
//     data[timeoutInputIndex].options[5] !== values.timeout
//   ) {
//     data[timeoutInputIndex].options[5] = values.timeout
//   }
// }
export default function FormEditMetadata({
  data,
  setShowEdit,
  setTimeoutStringValue,
  values,
  showPrice,
  isComputeDataset
}: {
  data: InputProps[]
  setShowEdit: (show: boolean) => void
  setTimeoutStringValue: (value: string) => void
  values: Partial<FormPublishData>
  showPrice: boolean
  isComputeDataset: boolean
}): ReactElement {
  const { config } = useOcean()
  const {
    validateField,
    setFieldValue
  }: FormikContextType<Partial<FormPublishData>> = useFormikContext()

  // Manually handle change events instead of using `handleChange` from Formik.
  // Workaround for default `validateOnChange` not kicking in
  function handleFieldChange(
    e: ChangeEvent<HTMLInputElement>,
    field: InputProps
  ) {
    validateField(field.name)
    setFieldValue(field.name, e.target.value)
  }
  // This component is handled by Formik so it's not rendered like a "normal" react component,
  // so handleTimeoutCustomOption is called only once.
  // https://github.com/oceanprotocol/market/pull/324#discussion_r561132310
  // if (data && values) handleTimeoutCustomOption(data, values)

  const timeoutOptionsArray = data.filter(
    (field) => field.name === 'timeout'
  )[0].options

  // if (isComputeDataset && timeoutOptionsArray.includes('Forever')) {
  //   const foreverOptionIndex = timeoutOptionsArray.indexOf('Forever')
  //   timeoutOptionsArray.splice(foreverOptionIndex, 1)
  // } else if (!isComputeDataset && !timeoutOptionsArray.includes('Forever')) {
  //   timeoutOptionsArray.push('Forever')
  // }

  return (
    <Form className={styles.form}>
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
              prefix={field.name === 'price' && config.oceanTokenSymbol}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleFieldChange(e, field)
              }
            />
          )
      )}

      {/* <FormActions
        setShowEdit={setShowEdit}
        handleClick={() => setTimeoutStringValue(values.timeout)}
      /> */}
    </Form>
  )
}
