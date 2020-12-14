import React, { useState, ChangeEvent, FormEvent, ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import styles from './SearchBar.module.css'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import InputGroup from '../atoms/Input/InputGroup'

export default function SearchBar({
  placeholder,
  initialValue,
  filters,
  size,
  setText = null
}: {
  placeholder?: string
  initialValue?: string
  filters?: boolean
  size?: 'small' | 'large'
  setText: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue || '')

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function startSearch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    if (setText) {
      setText(value)
    } else {
      if (value === '') return
      navigate(`/search?text=${value}`)
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
        <Button onClick={(e: FormEvent<HTMLButtonElement>) => startSearch(e)}>
          Search
        </Button>
      </InputGroup>

      {filters && <fieldset className={styles.filters}>Type, Price</fieldset>}
    </form>
  )
}
