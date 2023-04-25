import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import InputElement from '..'
import Label from '../../Label'
import styles from './InputOptions.module.css'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import { InputProps } from '@shared/FormInput'
import { useField } from 'formik'

export interface InputOption {
  [key: string]: string
}

export default function InputOptions({
  optionIndex,
  ...props
}: InputProps & { optionIndex: number }): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  const [currentKey, setCurrentKey] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [disabledButton, setDisabledButton] = useState(true)

  const [options, setOptions] = useState<InputOption[]>([])

  const addOption = () => {
    setOptions([
      ...options,
      {
        [currentKey]: currentValue
      }
    ])
    setCurrentKey('')
    setCurrentValue('')
  }

  const removeOption = (i: number) => {
    const newOptions = options.filter(
      (option, optionIndex) => optionIndex !== i
    )
    setOptions(newOptions)
    setCurrentKey('')
    setCurrentValue('')
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const checkType = e.target.name.search('key')
    checkType > 0
      ? setCurrentKey(e.target.value)
      : setCurrentValue(e.target.value)

    return e
  }

  useEffect(() => {
    if (!field?.value || !helpers) return
    helpers.setValue(
      field.value.map((p, i) => {
        if (i !== optionIndex) return p

        return {
          ...p,
          options: [...options]
        }
      })
    )
  }, [options])

  useEffect(() => {
    setDisabledButton(!currentKey || !currentValue)
  }, [currentKey, currentValue])

  return (
    <div>
      <Label htmlFor={props.name}>
        {props?.label}
        {props?.required && (
          <span title="Required" className={styles.required}>
            *
          </span>
        )}
        {props?.help && !props?.prominentHelp && (
          <Tooltip content={<Markdown text={props.help} />} />
        )}
      </Label>

      <div className={styles.headersContainer}>
        <InputElement
          name={`${name}.key`}
          placeholder={'key'}
          value={`${currentKey}`}
          onChange={handleChange}
        />

        <InputElement
          className={`${styles.input}`}
          name={`${name}.value`}
          placeholder={'value'}
          value={`${currentValue}`}
          onChange={handleChange}
        />

        <Button
          style="primary"
          size="small"
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault()
            addOption()
          }}
          disabled={disabledButton}
        >
          add
        </Button>
      </div>

      {options.length > 0 &&
        options.map((option, i) => {
          return (
            <div className={styles.headersAddedContainer} key={`option_${i}`}>
              <InputElement
                name={`option[${i}].key`}
                value={Object.keys(option)[0]}
                disabled
              />

              <InputElement
                name={`option[${i}].value`}
                value={Object.values(option)[0]}
                disabled
              />

              <Button
                style="primary"
                size="small"
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault()
                  removeOption(i)
                }}
                disabled={false}
              >
                remove
              </Button>
            </div>
          )
        })}
    </div>
  )
}
