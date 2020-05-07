import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/router'
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
  const router = useRouter()
  const [value, setValue] = useState(initialValue || '')
  const [searchStarted, setSearchStarted] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  function startSearch(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (value === '') return

    setSearchStarted(true)
    router.push(`/search?text=${value}`)
  }

  useEffect(() => {
    // fix for storybook
    if (!router) return

    router.events.on('routeChangeComplete', () => setSearchStarted(false))

    return () => {
      router.events.off('routeChangeComplete', () => setSearchStarted(false))
    }
  }, [])

  return (
    <form className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="search"
          className={large ? `${styles.input} ${styles.large}` : styles.input}
          placeholder={placeholder || 'What are you looking for?'}
          value={value}
          onChange={e => handleChange(e)}
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
