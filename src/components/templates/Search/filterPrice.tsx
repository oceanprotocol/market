import React, { ReactElement, useState } from 'react'
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

  const [priceSelections, setPriceSelections] = useState<string[]>([])
  const [serviceSelections, setServiceSelections] = useState<string[]>([])

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
    if (filterBy && location.search.indexOf('&serviceType') === -1) {
      urlLocation = `${urlLocation}&serviceType=${filterBy}`
    }
    setServiceType(filterBy)
    navigate(urlLocation)
  }

  async function handleSelectedFilter(isSelected: boolean, value: string) {
    if (
      value === FilterByPriceOptions.Fixed ||
      value === FilterByPriceOptions.Dynamic
    ) {
      if (isSelected) {
        if (priceSelections.length > 1) {
          // both selected -> select the other one
          const otherValue = priceFilterItems.find((p) => p.value !== value)
            .value
          await applyPriceFilter(otherValue)
          setPriceSelections([otherValue])
        } else {
          // only the current one selected -> deselect it
          await applyPriceFilter(undefined)
          setPriceSelections([])
        }
      } else {
        if (priceSelections.length) {
          // one already selected -> both selected
          await applyPriceFilter(FilterByPriceOptions.All)
          setPriceSelections(priceFilterItems.map((p) => p.value))
        } else {
          // none selected -> select
          await applyPriceFilter(value)
          setPriceSelections([value])
        }
      }
    } else {
      if (isSelected) {
        if (serviceSelections.length > 1) {
          const otherValue = serviceFilterItems.find((p) => p.value !== value)
            .value
          await applyServiceFilter(otherValue)
          setServiceSelections([otherValue])
        } else {
          await applyServiceFilter(undefined)
          setServiceSelections([])
        }
      } else {
        if (serviceSelections.length) {
          await applyServiceFilter(undefined)
          setServiceSelections(serviceFilterItems.map((p) => p.value))
        } else {
          await applyServiceFilter(value)
          setServiceSelections([value])
        }
      }
    }
  }

  return (
    <div className={styles.filterList}>
      {priceFilterItems.map((e, index) => {
        const isSelected =
          e.value === priceType || priceSelections.includes(e.value)
        const selectFilter = cx({
          [styles.selected]: isSelected,
          [styles.filter]: true
        })
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={selectFilter}
            onClick={async () => {
              handleSelectedFilter(isSelected, e.value)
            }}
          >
            {e.display}
          </Button>
        )
      })}
      {serviceFilterItems.map((e, index) => {
        const isSelected =
          e.value === serviceType || serviceSelections.includes(e.value)
        const selectFilter = cx({
          [styles.selected]: isSelected,
          [styles.filter]: true
        })
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={selectFilter}
            onClick={async () => {
              handleSelectedFilter(isSelected, e.value)
            }}
          >
            {e.display}
          </Button>
        )
      })}
    </div>
  )
}
