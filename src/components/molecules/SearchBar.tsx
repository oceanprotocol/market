import React, { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import { navigate } from 'gatsby'
import styles from './SearchBar.module.css'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import InputGroup from '../atoms/Input/InputGroup'
import { addExistingParamsToUrl } from '../templates/Search/utils'

export default function SearchBar({
  placeholder,
  initialValue,
  filters,
  size
}: {
  placeholder?: string
  initialValue?: string
  filters?: boolean
  size?: 'small' | 'large'
}): ReactElement {
  const [value, setValue] = useState(initialValue || '')

  async function startSearch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    const urlEncodedValue = encodeURIComponent(value)
    console.log('urlEncodedValue', urlEncodedValue)
    const url = await addExistingParamsToUrl(location, 'text')
    navigate(`${url}&text=${urlEncodedValue}`)
  }

  async function emptySearch(e: ChangeEvent<HTMLInputElement>) {
    const searchParams = new URLSearchParams(window.location.href)
    const text = searchParams.get('text')
    console.log('text', text)
    if (text !== ('' || undefined || null)) {
      const url = await addExistingParamsToUrl(location, 'text')
      navigate(`${url}&text=${e.target.value}`)
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    if (e.target.value === '') {
      emptySearch(e)
    }
  }

  return (
    <form className={styles.form}>
      <InputGroup>
        <Input
          type="search"
          name="search"
          placeholder={placeholder || 'What are you looking for?'}
          value={value}
          onChange={handleChange}
          required
          size={size}
        />
        <Button
          onClick={async (e: FormEvent<HTMLButtonElement>) =>
            await startSearch(e)
          }
        >
          Search
        </Button>
      </InputGroup>

      {filters && <fieldset className={styles.filters}>Type, Price</fieldset>}
    </form>
  )
}
