import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import InputElement from '..'
import Label from '../../Label'
import styles from './InputOptions.module.css'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import { InputProps } from '@shared/FormInput'
import { useField } from 'formik'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export interface InputOption {
  [value: string]: string
}

export default function InputOptions({
  optionIndex,
  defaultOptions = [],
  ...props
}: InputProps & {
  optionIndex: number
  defaultOptions: InputOption[]
}): ReactElement {
  const [field, meta, helpers] = useField(props.name)

  const [currentValue, setCurrentValue] = useState('')
  const [currentLabel, setCurrentLabel] = useState('')
  const [disabledButton, setDisabledButton] = useState(true)
  const [hasError, setHasError] = useState(false)

  const [options, setOptions] = useState<InputOption[]>(defaultOptions)

  const addOption = () => {
    const hasError = options.some((option) =>
      Object.keys(option).includes(currentValue)
    )
    if (hasError) {
      setHasError(hasError)
      return
    }

    setOptions([
      ...options,
      {
        [currentValue]: currentLabel
      }
    ])
    setCurrentValue('')
    setCurrentLabel('')
  }

  const removeOption = (i: number) => {
    const newOptions = options.filter(
      (option, optionIndex) => optionIndex !== i
    )
    setOptions(newOptions)
    setCurrentValue('')
    setCurrentLabel('')
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const checkType = e.target.name.search('value')
    checkType > 0
      ? setCurrentValue(e.target.value)
      : setCurrentLabel(e.target.value)

    return e
  }

  useEffect(() => {
    if (!field?.value || !helpers) return
    helpers.setValue(
      field.value.map((currentParam, i) => {
        if (i !== optionIndex) return currentParam

        return {
          ...currentParam,
          options: [...options]
        }
      })
    )
  }, [options])

  useEffect(() => {
    setDisabledButton(!currentValue || !currentLabel)
    setHasError(false)
  }, [currentValue, currentLabel])

  return (
    <div className={cx({ container: true, hasError })}>
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
        <div className={styles.valueContainer}>
          <InputElement
            name={`${name}.value`}
            placeholder={'value'}
            value={`${currentValue}`}
            onChange={handleChange}
          />
          {hasError && <p className={styles.error}>The key must be unique</p>}
        </div>

        <div>
          <InputElement
            className={`${styles.input}`}
            name={`${name}.label`}
            placeholder={'label'}
            value={`${currentLabel}`}
            onChange={handleChange}
          />
        </div>

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
                name={`option[${i}].value`}
                value={Object.keys(option)[0]}
                disabled
              />

              <InputElement
                name={`option[${i}].label`}
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
