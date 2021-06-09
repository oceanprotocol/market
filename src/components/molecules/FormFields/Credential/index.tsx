import { useField } from 'formik'
import { InputProps } from '../../../atoms/Input'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import InputGroup from '../../../atoms/Input/InputGroup'
import Button from '../../../atoms/Button'
import styles from './Credential.module.css'
import { isAddress } from 'web3-utils'
import { toast } from 'react-toastify'
import { ReactComponent as Cross } from '../../../../images/cross.svg'

export default function Credential(props: InputProps) {
  const [field, meta, helpers] = useField(props.name)
  const [arrayInput, setArrayInput] = useState<string[]>(field.value || [])
  const [value, setValue] = useState('')

  useEffect(() => {
    helpers.setValue(arrayInput)
  }, [arrayInput])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function handleDeleteChip(value: string) {
    const newInput = arrayInput.filter((input) => input !== value)
    setArrayInput(newInput)
    helpers.setValue(newInput)
  }

  function isCredentialValid(): boolean {
    if (!isAddress(value)) {
      toast.error('Wallet address is invalid')
      return false
    }
    if (arrayInput.includes(value)) {
      toast.error('Wallet address already added into list')
      return false
    }
    return true
  }

  function handleAddValue(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (isCredentialValid()) {
      setArrayInput((arrayInput) => [...arrayInput, value])
      setValue('')
    }
  }

  return (
    <div className={styles.credential}>
      <InputGroup>
        <input
          className={styles.input}
          placeholder={props.placeholder}
          name="search"
          onChange={handleChange}
          value={value}
        />
        <Button
          onClick={(e: FormEvent<HTMLButtonElement>) => handleAddValue(e)}
        >
          Add
        </Button>
      </InputGroup>
      <div className={styles.scroll}>
        {arrayInput &&
          arrayInput.map((value) => {
            return (
              <div className={styles.chip} key={value}>
                {value}
                <span className={styles.buttonWrapper}>
                  <Button
                    className={styles.crossButton}
                    style="text"
                    onClick={(even) => handleDeleteChip(value)}
                  >
                    <Cross />
                  </Button>
                </span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
