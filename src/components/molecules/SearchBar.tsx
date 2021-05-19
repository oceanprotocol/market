import React, { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import { navigate } from 'gatsby'
import Button from '../atoms/Button'
import InputGroup from '../atoms/Input/InputGroup'
import Input from '../atoms/Input'
import { addExistingParamsToUrl } from '../templates/Search/utils'
import { form } from './SearchBar.module.css'

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
  let [value, setValue] = useState(initialValue || '')

  async function startSearch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (value === '') value = ' '
    const urlEncodedValue = encodeURIComponent(value)
    const url = await addExistingParamsToUrl(location, 'text')
    navigate(`${url}&text=${urlEncodedValue}`)
  }

  async function emptySearch() {
    const searchParams = new URLSearchParams(window.location.href)
    const text = searchParams.get('text')
    if (text !== ('' || undefined || null)) {
      const url = await addExistingParamsToUrl(location, 'text')
      navigate(`${url}&text=%20`)
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
    e.target.value === '' && emptySearch()
  }

  return (
    <form className={form}>
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

      {filters && <fieldset>Type, Price</fieldset>}
    </form>
  )
}
