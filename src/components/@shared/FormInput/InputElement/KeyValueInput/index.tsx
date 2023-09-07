import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState
} from 'react'
import InputElement from '..'
import Label from '../../Label'
import styles from './index.module.css'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import Button from '@shared/atoms/Button'
import { InputProps } from '@shared/FormInput'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export interface KeyValuePair {
  key: string
  value: string
}

export interface KeyValueInputProps extends Omit<InputProps, 'value'> {
  value: KeyValuePair[]
  uniqueKeys?: boolean
  keyPlaceholder?: string
  valuePlaceholder?: string
}

export default function InputKeyValue({
  uniqueKeys = false,
  value,
  keyPlaceholder = 'key',
  valuePlaceholder = 'value',
  ...props
}: KeyValueInputProps): ReactElement {
  const { label, help, prominentHelp, form, field } = props

  const [currentKey, setCurrentKey] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [disabledButton, setDisabledButton] = useState(true)
  const [hasOnlyUniqueKeys, setHasOnlyUniqueKeys] = useState(true)

  const [pairs, setPairs] = useState(value || [])

  const currentKeyExists = useCallback(() => {
    return pairs.some((pair) => pair.key === currentKey)
  }, [currentKey, pairs])

  const addPair = () => {
    if (currentKeyExists()) {
      setHasOnlyUniqueKeys(false)
      if (uniqueKeys) return
    }

    setPairs((prev) => [
      ...prev,
      {
        key: currentKey,
        value: currentValue
      }
    ])
    setCurrentKey('')
    setCurrentValue('')
  }

  const removePair = (index: number) => {
    const newPairs = pairs.filter((pair, pairIndex) => pairIndex !== index)
    setPairs(newPairs)
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
    form.setFieldValue(`${field.name}`, pairs)
  }, [pairs])

  useEffect(() => {
    setDisabledButton(
      !currentKey || !currentValue || (uniqueKeys && currentKeyExists())
    )
    setHasOnlyUniqueKeys(!currentKeyExists())
  }, [currentKey, currentValue, uniqueKeys, currentKeyExists])

  return (
    <div
      className={cx({
        hasError: uniqueKeys && !hasOnlyUniqueKeys
      })}
    >
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

      <div className={styles.pairsContainer}>
        <InputElement
          className={styles.keyInput}
          name={`${field.name}.key`}
          placeholder={keyPlaceholder}
          value={`${currentKey}`}
          onChange={handleChange}
        />

        <InputElement
          className={styles.input}
          name={`${field.name}.value`}
          placeholder={valuePlaceholder}
          value={`${currentValue}`}
          onChange={handleChange}
        />

        <Button
          style="primary"
          size="small"
          onClick={(e: React.SyntheticEvent) => {
            e.preventDefault()
            addPair()
          }}
          disabled={disabledButton}
        >
          add
        </Button>

        {uniqueKeys && !hasOnlyUniqueKeys && (
          <p
            className={styles.error}
          >{`The ${keyPlaceholder} field must be unique`}</p>
        )}
      </div>

      {pairs.length > 0 &&
        pairs.map((header, i) => {
          return (
            <div className={styles.pairsAddedContainer} key={`pair_${i}`}>
              <InputElement
                name={`pair[${i}].key`}
                value={`${header.key}`}
                disabled
              />

              <InputElement
                name={`pair[${i}].value`}
                value={`${header.value}`}
                disabled
              />

              <Button
                style="primary"
                size="small"
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault()
                  removePair(i)
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
