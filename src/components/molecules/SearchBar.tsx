import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from '@reach/router'
import styles from './SearchBar.module.css'
import Loader from '../atoms/Loader'
import Button from '../atoms/Button'

export default function SearchBar({
  placeholder,
  initialValue,
  filters,
  large
}: {
  placeholder?: string
  initialValue?: string
  filters?: boolean
  large?: true
}) {
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue || '')
  const [searchStarted, setSearchStarted] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function startSearch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (value === '') return

    setSearchStarted(true)
    navigate(`/search?text=${value}`)
  }

  return (
    <form className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="search"
          className={large ? `${styles.input} ${styles.large}` : styles.input}
          placeholder={placeholder || 'What are you looking for?'}
          value={value}
          onChange={(e) => handleChange(e)}
          required
        />
        <Button onClick={(e: FormEvent<HTMLButtonElement>) => startSearch(e)}>
          {searchStarted ? <Loader /> : 'Search'}
        </Button>
      </div>

      {filters && <fieldset className={styles.filters}>Type, Price</fieldset>}
    </form>
  )
}
