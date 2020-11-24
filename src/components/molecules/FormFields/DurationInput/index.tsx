import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { useField } from 'formik'
import { InputProps } from '../../../atoms/Input'
import InputGroup from '../../../atoms/Input/InputGroup'
import Help from '../../../atoms/Input/Help'
import styles from './index.module.css'
import { Timeout } from '../../../../@types/MetaData'

export function computeTimeoutInSecons(
  values: Partial<Timeout>
): number | undefined {
  if (!values) return undefined
  let { years, months, days, hours, minutes, seconds } = values
  if (!years && !months && !days && !hours && !minutes && !seconds) {
    return undefined
  }
  if (!years) years = 0
  if (!months) months = 0
  if (!days) days = 0
  if (!hours) hours = 0
  if (!minutes) minutes = 0
  if (!seconds) seconds = 0
  let ret = years
  ret = ret * 12 + months
  ret = ret * 30.4375 + days
  ret = ret * 24 + hours
  ret = ret * 60 + minutes
  ret = ret * 60 + seconds
  return ret
}

function unit(key: string, value: number) {
  if (value === 1) {
    return key.slice(0, -1)
  }
  return key
}

export function MetaTimeout({ content }: { content: any }) {
  return (
    <>
      {Object.keys(content)
        .map((key) =>
          content[key] ? `${content[key]} ${unit(key, content[key])}` : null
        )
        .filter((v) => v)
        .join(', ')}
    </>
  )
}

function TimeUnit(props: any) {
  return (
    <>
      <label>
        <input
          {...props}
          value={props.value}
          className={`${styles.input}`}
          type="number"
          placeholder="-"
          name={props.name + '.' + props.border}
        />
        <div className={`${styles.unit}`}>
          <span style={{ background: 'white' }}>
            {unit(props.border, props.value)}
          </span>
        </div>
      </label>
    </>
  )
}

export default function DurationInput(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [seconds, setSeconds] = useState(null)
  function setValue(name: string, value: string) {
    helpers.setValue({
      ...field.value,
      [name]: value.length ? Number(value) : ''
    })
  }
  useEffect(() => {
    setSeconds(computeTimeoutInSecons(field.value))
  }, [field])
  return (
    <>
      <InputGroup customClass="duration-input-group">
        <TimeUnit
          {...props}
          {...field}
          border="years"
          value={field.value?.years}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue('years', e.target.value)
          }
        />
        <TimeUnit
          {...props}
          {...field}
          border="months"
          value={field.value?.months}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue('months', e.target.value)
          }
        />
        <TimeUnit
          {...props}
          {...field}
          border="days"
          value={field.value?.days}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue('days', e.target.value)
          }
        />
        <TimeUnit
          {...props}
          {...field}
          border="hours"
          value={field.value?.hours}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue('hours', e.target.value)
          }
        />
        <TimeUnit
          {...props}
          {...field}
          border="minutes"
          value={field.value?.minutes}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue('minutes', e.target.value)
          }
        />
        <TimeUnit
          {...props}
          {...field}
          border="seconds"
          value={field.value?.seconds}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue('seconds', e.target.value)
          }
        />
      </InputGroup>
      <Help>
        {seconds ? `= ${seconds} seconds` : `default = ${props.placeholder}`}
      </Help>
      {field.value.years > 0 ? <Help>(1 year = 365.25 days.)</Help> : ''}
      {field.value.months > 0 ? (
        <Help>(1 month = 30 days and 10.5 hours.)</Help>
      ) : (
        ''
      )}
    </>
  )
}
