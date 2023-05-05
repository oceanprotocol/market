import { AlgorithmConsumerParameter } from '@components/Publish/_types'
import React, { ReactElement, useEffect, useState } from 'react'
import styles from './ConsumerParameters.module.css'
import Label from '@components/@shared/FormInput/Label'
import InputElement from '@components/@shared/FormInput/InputElement'
import { getConsumerParameterStringOptions } from '@components/@shared/FormInput/InputElement/ConsumerParameters'

export default function ConsumerParameters({
  parameters
}: {
  parameters: AlgorithmConsumerParameter[]
}): ReactElement {
  const [selectedValues, setSelectedValues] = useState({})

  useEffect(() => {
    const defaultValues = {}
    parameters.forEach((param) => (defaultValues[param.name] = param.default))

    setSelectedValues(defaultValues)
  }, [])

  console.log(selectedValues)
  console.log(parameters)
  const requiredParameters = parameters.filter((param) => param.required)
  const optionalParameters = parameters.filter((param) => !param.required)
  return (
    <div className={styles.container}>
      <Label htmlFor="required parameters">Required parameters</Label>
      <div className={styles.parametersContainer}>
        {parameters?.map((param) => (
          <div key={param.name}>
            <Label htmlFor={param.name}>{param.label}</Label>
            <p className={styles.description}>{param.description}</p>
            <p className={styles.description}>{`type: ${param.type}`}</p>
            <InputElement
              name={param.name}
              type={param.type === 'boolean' ? 'select' : param.type}
              options={
                param.type === 'boolean'
                  ? ['true', 'false']
                  : param.type === 'select'
                  ? getConsumerParameterStringOptions(
                      param?.options as {
                        [key: string]: string
                      }[]
                    )
                  : param.options
              }
              default={param.default}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
