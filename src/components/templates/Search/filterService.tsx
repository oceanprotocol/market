import React, { ReactElement, useState } from 'react'
import { useNavigate } from '@reach/router'
import styles from './filterService.module.css'
import classNames from 'classnames/bind'
import {
  addExistingParamsToUrl,
  FilterByAccessOptions,
  FilterByTypeOptions
} from './utils'
import Button from '../../atoms/Button'

const cx = classNames.bind(styles)

const clearFilters = [{ display: 'Clear', value: '' }]

const serviceFilterItems = [
  { display: 'data sets', value: FilterByTypeOptions.Data },
  { display: 'algorithms', value: FilterByTypeOptions.Algorithm }
]

const accessFilterItems = [
  { display: 'download ', value: FilterByAccessOptions.Download },
  { display: 'compute ', value: FilterByAccessOptions.Compute }
]

export default function FilterPrice({
  serviceType,
  accessType,
  setServiceType,
  setAccessType
}: {
  serviceType: string
  accessType: string
  setServiceType: React.Dispatch<React.SetStateAction<string>>
  setAccessType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()
  const [serviceSelections, setServiceSelections] = useState<string[]>([])
  const [accessSelections, setAccessSelections] = useState<string[]>([])

  async function applyServiceFilter(filterBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, ['serviceType'])
    if (filterBy && location.search.indexOf('&serviceType') === -1) {
      urlLocation = `${urlLocation}&serviceType=${filterBy}`
    }
    setServiceType(filterBy)
    navigate(urlLocation)
  }

  async function applyAccessFilter(filterBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, ['accessType'])
    if (filterBy && location.search.indexOf('&accessType') === -1) {
      urlLocation = `${urlLocation}&accessType=${filterBy}`
    }
    setAccessType(filterBy)
    navigate(urlLocation)
  }

  async function handleSelectedFilter(isSelected: boolean, value: string) {
    if (
      value === FilterByAccessOptions.Download ||
      value === FilterByAccessOptions.Compute
    ) {
      if (isSelected) {
        if (accessSelections.length > 1) {
          // both selected -> select the other one
          const otherValue = accessFilterItems.find(
            (p) => p.value !== value
          ).value
          console.log('VALUE both selected -> select the other one: ', value)
          await applyAccessFilter(otherValue)
        } else {
          // only the current one selected -> deselect it
          console.log('VALUE both selected -> select the other one: ', value)
          await applyAccessFilter(undefined)
        }
      } else {
        if (accessSelections.length > 0) {
          // one already selected -> both selected
          console.log('VALUE one already selected -> both selected: ', value)
          await applyAccessFilter(FilterByAccessOptions.All)
          setAccessSelections(accessFilterItems.map((p) => p.value))
        } else {
          // none selected -> select
          console.log('VALUE none  selected -> select: ', value)
          await applyAccessFilter(value)
          setAccessSelections([value])
        }
      }
    } else {
      if (isSelected) {
        if (serviceSelections.length > 1) {
          const otherValue = serviceFilterItems.find(
            (p) => p.value !== value
          ).value
          await applyServiceFilter(otherValue)
          setServiceSelections([otherValue])
        } else {
          await applyServiceFilter(undefined)
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

  async function applyClearFilter() {
    let urlLocation = await addExistingParamsToUrl(location, [
      'accessType',
      'serviceType'
    ])

    urlLocation = `${urlLocation}`

    setServiceSelections([])
    setAccessSelections([])

    setServiceType(undefined)
    setAccessType(undefined)
    navigate(urlLocation)
  }

  return (
    <div className={styles.filterList}>
      {serviceFilterItems.map((e, index) => {
        const isServiceSelected =
          e.value === serviceType || serviceSelections.includes(e.value)
        const selectFilter = cx({
          [styles.selected]: isServiceSelected,
          [styles.filter]: true
        })
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={selectFilter}
            onClick={async () => {
              handleSelectedFilter(isServiceSelected, e.value)
            }}
          >
            {e.display}
          </Button>
        )
      })}
      {accessFilterItems.map((e, index) => {
        console.log(
          'ACCESS SELECTIONS: ',
          accessSelections,
          e.value,
          accessSelections.includes(e.value)
        )
        const isAccessSelected =
          e.value === accessType || accessSelections.includes(e.value)
        const selectFilter = cx({
          [styles.selected]: isAccessSelected,
          [styles.filter]: true
        })
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={selectFilter}
            onClick={async () => {
              handleSelectedFilter(isAccessSelected, e.value)
            }}
          >
            {e.display}
          </Button>
        )
      })}
      {clearFilters.map((e, index) => {
        const showClear = serviceSelections.length > 0
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={showClear ? styles.showClear : styles.hideClear}
            onClick={async () => {
              applyClearFilter()
            }}
          >
            {e.display}
          </Button>
        )
      })}
    </div>
  )
}
