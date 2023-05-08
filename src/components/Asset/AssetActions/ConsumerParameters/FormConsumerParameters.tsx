import { AlgorithmConsumerParameter } from '@components/Publish/_types'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import styles from './FormConsumerParameters.module.css'
import Label from '@components/@shared/FormInput/Label'
import { getConsumerParameterStringOptions } from '@components/@shared/FormInput/InputElement/ConsumerParameters'
import FormInput from '@shared/FormInput'

export default function FormConsumerParameters({
  parameters
}: {
  parameters: AlgorithmConsumerParameter[]
}): ReactElement {
  const [selectedValues, setSelectedValues] = useState({})
  console.log(selectedValues)
  useEffect(() => {
    const defaultValues = {}
    parameters.forEach((param) => (defaultValues[param.name] = param.default))

    setSelectedValues(defaultValues)
  }, [parameters])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    paramName: string
  ) => {
    const updatedSelectedValues = {
      ...selectedValues,
      [paramName]: e.target.value
    }
    setSelectedValues(updatedSelectedValues)
  }

  return (
    <div className={styles.container}>
      <Label htmlFor="Input the consumer parameters">
        Input the consumer parameters
      </Label>
      <div className={styles.parametersContainer}>
        {parameters?.map((param) => (
          <div key={param.name} className={styles.parameter}>
            <FormInput
              help={param.description}
              label={param.label}
              name={param.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(e, param.name)
              }
              options={
                param.type === 'boolean'
                  ? ['true', 'false']
                  : param.type === 'select'
                  ? getConsumerParameterStringOptions(
                      param?.options as {
                        [key: string]: string
                      }[]
                    )
                  : (param.options as unknown as string[])
              }
              required={param.required === 'required'}
              size="small"
              type={param.type === 'boolean' ? 'select' : param.type}
              value={selectedValues[param.name]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
