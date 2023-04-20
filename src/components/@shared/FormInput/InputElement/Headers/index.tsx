import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import InputElement from '../../InputElement'
import Label from '../../Label'
import styles from './index.module.css'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import { InputProps } from '@shared/FormInput'

export interface QueryHeader {
  key: string
  value: string
}

export default function InputHeaders(props: InputProps): ReactElement {
  const { label, help, prominentHelp, form, field } = props

  const [currentKey, setCurrentKey] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [disabledButton, setDisabledButton] = useState(true)

  const [headers, setHeaders] = useState([] as QueryHeader[])

  const addHeader = () => {
    setHeaders((prev) => [
      ...prev,
      {
        key: currentKey,
        value: currentValue
      }
    ])
    setCurrentKey('')
    setCurrentValue('')
  }

  const removeHeader = (i: number) => {
    const newHeaders = headers.filter((header, index) => index !== i)
    setHeaders(newHeaders)
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
    form.setFieldValue(`${field.name}`, headers)
  }, [headers])

  useEffect(() => {
    setDisabledButton(!currentKey || !currentValue)
  }, [currentKey, currentValue])

  return (
    <div>
      <Label htmlFor={props.name}>
        {label}
        {props.required && (
          <span title="Required" className={styles.required}>
            *
          </span>
        )}
        {help && !prominentHelp && (
          <Tooltip content={<Markdown text={help} />} />
        )}
      </Label>

      <div className={styles.headersContainer}>
        <InputElement
          name={`${field.name}.key`}
          placeholder={'key'}
          value={`${currentKey}`}
          onChange={handleChange}
        />

        <InputElement
          className={`${styles.input}`}
          name={`${field.name}.value`}
          placeholder={'value'}
          value={`${currentValue}`}
          onChange={handleChange}
        />

        <Button
          style="primary"
          size="small"
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault()
            addHeader()
          }}
          disabled={disabledButton}
        >
          add
        </Button>
      </div>

      {headers.length > 0 &&
        headers.map((header, i) => {
          return (
            <div className={styles.headersAddedContainer} key={`header_${i}`}>
              <InputElement
                name={`header[${i}].key`}
                value={`${header.key}`}
                disabled
              />

              <InputElement
                name={`header[${i}].key`}
                value={`${header.value}`}
                disabled
              />

              <Button
                style="primary"
                size="small"
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault()
                  removeHeader(i)
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
