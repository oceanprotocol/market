import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  ReactElement
} from 'react'
import { navigate } from 'gatsby'
import queryString from 'query-string'
import styles from './SearchBar.module.css'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import InputGroup from '../atoms/Input/InputGroup'
import { addExistingParamsToUrl } from '../templates/Search/utils'
import { ReactComponent as SearchIcon } from '../../images/search.svg'

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
  const parsed = queryString.parse(location.search)
  const { text, owner } = parsed

  useEffect(() => {
    ;(text || owner) && setValue((text || owner) as string)
  }, [text, owner])
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
          style="text"
          size="small"
          className={styles.button}
        >
          <SearchIcon className={styles.searchIcon} />
        </Button>
      </InputGroup>

      {filters && <fieldset className={styles.filters}>Type, Price</fieldset>}
    </form>
  )
}
