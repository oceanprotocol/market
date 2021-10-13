import { useField } from 'formik'
import { InputProps } from '../../../atoms/Input'
import React, { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import InputGroup from '../../../atoms/Input/InputGroup'
import Button from '../../../atoms/Button'
import styles from './Credential.module.css'
import { isAddress } from 'web3-utils'
import { toast } from 'react-toastify'
import { ReactComponent as Cross } from '../../../../images/cross.svg'
import InputElement from '../../../atoms/Input/InputElement'
import appConfig from '../../../../../app.config'
import { Credential } from '@oceanprotocol/lib'
import {
  getCredentialList,
  updateCredential
} from '../../../../utils/credential'

export default function Credentials(props: InputProps): ReactElement {
  const [field, meta, helpers] = useField(props.name)
  const [arrayInput, setArrayInput] = useState<string[]>()
  const [value, setValue] = useState('')
  const [type, setType] = useState('')
  const initialValues = field.value as Credential[]
  const { credentialType } = appConfig

  function handleDeleteChip(value: string) {
    const newInput = arrayInput.filter((input) => input !== value)
    setArrayInput(newInput)
    helpers.setValue(newInput)
  }

  function handleAddValue(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (type === 'address' && !isAddress(value)) {
      toast.error('Wallet address is invalid')
      return
    }
    if (arrayInput.includes(value.toLowerCase())) {
      toast.error('Wallet address already added into list')
      return
    }
    setArrayInput((arrayInput) => [...arrayInput, value.toLowerCase()])
    updateCredential(initialValues, type, [...arrayInput, value.toLowerCase()])
    setValue('')
  }

  function handlCredentialTypeChange(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault()
    const credentialList = getCredentialList(initialValues, e.target.value)
    setArrayInput(credentialList)
    setType(e.target.value)
  }

  return (
    <div className={styles.credential}>
      <InputElement
        type="select"
        name="credentialType"
        size="default"
        placeholder="Crential Type"
        options={credentialType}
        value={type}
        onChange={handlCredentialTypeChange}
      />
      <InputGroup>
        <InputElement
          type="text"
          name="address"
          size="default"
          placeholder={props.placeholder}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
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
                <code>{value}</code>
                <span className={styles.buttonWrapper}>
                  <Button
                    className={styles.crossButton}
                    style="text"
                    onClick={() => handleDeleteChip(value)}
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
