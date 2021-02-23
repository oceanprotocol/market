import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import styles from './filterPrice.module.css'
import classNames from 'classnames/bind'
import {
  addExistingParamsToUrl,
  FilterByPriceOptions,
  FilterByTypeOptions
} from './utils'
import Button from '../../atoms/Button'

const cx = classNames.bind(styles)

const filterItems = [
  { display: 'all', value: undefined },
  { display: 'fixed price', value: FilterByPriceOptions.Fixed },
  { display: 'dynamic price', value: FilterByPriceOptions.Dynamic },
  { display: 'data sets', value: FilterByTypeOptions.Data },
  { display: 'algorithms', value: FilterByTypeOptions.Algorithm }
]

export default function FilterPrice({
  priceType,
  setPriceType
}: {
  priceType: string
  setPriceType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()

  async function applyFilter(filterBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, 'priceType')
    if (filterBy) {
      urlLocation = `${urlLocation}&priceType=${filterBy}`
    }
    console.log('FILTER BY: ', filterBy)
    setPriceType(filterBy)
    navigate(urlLocation)
  }

  return (
    <div>
      <div className={styles.filterList}>
        {filterItems.map((e, index) => {
          const selectFilter = cx({
            [styles.selected]: e.value === priceType,
            [styles.filter]: true
          })
          const isSelected = e.value === priceType
          return (
            <Button
              size="small"
              style="text"
              key={index}
              className={selectFilter}
              onClick={
                isSelected
                  ? async () => {
                      await applyFilter(undefined)
                    }
                  : async () => {
                      await applyFilter(e.value)
                    }
              }
            >
              {e.display}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
