import React, { ChangeEvent } from 'react'
import SearchFilterSection from '../atoms/SearchFilterSection'
import usePriceQueryParams from '../../hooks/usePriceQueryParams'

import styles from './SearchPriceFilter.module.css'

export declare type PriceInputProps = {
  label: string
  value: string
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void
  text: string
}

export const PriceInput = ({
  label,
  value,
  onChange,
  text
}: PriceInputProps) => {
  return (
    <label htmlFor={label} className={styles.label}>
      <input
        id={label}
        name={label}
        type="number"
        min="0"
        value={value}
        onChange={onChange}
        className={styles.input}
      />
      <span>{text}</span>
    </label>
  )
}

export const SearchPriceFilter = () => {
  const { min, setMin, max, setMax } = usePriceQueryParams()

  return (
    <SearchFilterSection title="Filter by price in Ocean Tokens">
      <div className={styles.layout}>
        <PriceInput
          label="minPrice"
          value={min}
          onChange={(ev) => setMin(ev.target.value)}
          text="Min price"
        />
        <PriceInput
          label="maxPrice"
          value={max}
          onChange={(ev) => setMax(ev.target.value)}
          text="Max price"
        />
      </div>
    </SearchFilterSection>
  )
}
