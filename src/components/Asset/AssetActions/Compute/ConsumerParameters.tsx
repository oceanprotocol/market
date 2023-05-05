import { AlgorithmConsumerParameter } from '@components/Publish/_types'
import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
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
  }, [parameters])

  const groupedParameters = [
    {
      title: 'Required Parameters',
      content: parameters.filter((param) => param.required)
    },
    {
      title: 'Optional Parameters',
      content: parameters.filter((param) => !param.required)
    }
  ]

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
      {groupedParameters.map(
        (parameterGroup) =>
          parameterGroup.content.length > 0 && (
            <div
              key={parameterGroup.title}
              className={styles.parameterGroupContainer}
            >
              <Label htmlFor={parameterGroup.title}>
                {parameterGroup.title}
              </Label>
              <div className={styles.parametersContainer}>
                {parameterGroup.content?.map((param) => (
                  <div key={param.name} className={styles.parameter}>
                    <div key={param.name} className={styles.parameterDetails}>
                      <Label htmlFor={param.name}>{param.label}</Label>
                      <p className={styles.type}>{`type: ${param.type}`}</p>
                      <p className={styles.description}>{param.description}</p>
                      <InputElement
                        name={param.name}
                        label={param.label}
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
                            : (param.options as unknown as string[])
                        }
                        value={selectedValues[param.name]}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, param.name)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  )
}
