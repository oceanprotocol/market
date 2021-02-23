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

const priceFilterItems = [
  { display: 'all', value: undefined },
  { display: 'fixed price', value: FilterByPriceOptions.Fixed },
  { display: 'dynamic price', value: FilterByPriceOptions.Dynamic }
]

const serviceFilterItems = [
  { display: 'data sets', value: FilterByTypeOptions.Data },
  { display: 'algorithms', value: FilterByTypeOptions.Algorithm }
]

export default function FilterPrice({
  priceType,
  serviceType,
  setPriceType,
  setServiceType
}: {
  priceType: string
  setPriceType: React.Dispatch<React.SetStateAction<string>>
  serviceType: string
  setServiceType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()

  async function applyPriceFilter(filterBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, 'priceType')
    if (filterBy) {
      urlLocation = `${urlLocation}&priceType=${filterBy}`
    }
    setPriceType(filterBy)
    navigate(urlLocation)
  }

  async function applyServiceFilter(filterBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, 'serviceType')
    if (filterBy) {
      urlLocation = `${urlLocation}&serviceType=${filterBy}`
    }
    setServiceType(filterBy)
    navigate(urlLocation)
  }

  return (
    <div>
      <div className={styles.filterList}>
        {priceFilterItems.map((e, index) => {
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
                      await applyPriceFilter(undefined)
                    }
                  : async () => {
                      await applyPriceFilter(e.value)
                    }
              }
            >
              {e.display}
            </Button>
          )
        })}
        {serviceFilterItems.map((e, index) => {
          const selectFilter = cx({
            [styles.selected]: e.value === serviceType,
            [styles.filter]: true
          })
          const isSelected = e.value === serviceType
          return (
            <Button
              size="small"
              style="text"
              key={index}
              className={selectFilter}
              onClick={
                isSelected
                  ? async () => {
                      await applyServiceFilter(undefined)
                    }
                  : async () => {
                      await applyServiceFilter(e.value)
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
