import React, { ReactElement, useState } from 'react'
import classNames from 'classnames/bind'
import { addExistingParamsToUrl } from './utils'
import Button from '@shared/atoms/Button'
import {
  FilterByAccessOptions,
  FilterByTypeOptions
} from '../../@types/aquarius/SearchQuery'
import { useRouter } from 'next/router'
import styles from './Filters.module.css'

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
  setAccessType,
  addFiltersToUrl,
  className
}: {
  serviceType: string
  accessType: string
  setServiceType: React.Dispatch<React.SetStateAction<string>>
  setAccessType: React.Dispatch<React.SetStateAction<string>>
  addFiltersToUrl?: boolean
  className?: string
}): ReactElement {
  const router = useRouter()
  const [serviceSelections, setServiceSelections] = useState<string[]>([])
  const [accessSelections, setAccessSelections] = useState<string[]>([])

  async function applyFilter(filter: string, filterType: string) {
    filterType === 'accessType' ? setAccessType(filter) : setServiceType(filter)
    if (addFiltersToUrl) {
      let urlLocation = ''
      if (filterType.localeCompare('accessType') === 0) {
        urlLocation = await addExistingParamsToUrl(location, ['accessType'])
      } else {
        urlLocation = await addExistingParamsToUrl(location, ['serviceType'])
      }

      if (filter && location.search.indexOf(filterType) === -1) {
        filterType === 'accessType'
          ? (urlLocation = `${urlLocation}&accessType=${filter}`)
          : (urlLocation = `${urlLocation}&serviceType=${filter}`)
      }

      router.push(urlLocation)
    }
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
          await applyFilter(otherValue, 'accessType')
          setAccessSelections([otherValue])
        } else {
          // only the current one selected -> deselect it
          await applyFilter(undefined, 'accessType')
          setAccessSelections([])
        }
      } else {
        if (accessSelections.length) {
          // one already selected -> both selected
          await applyFilter(undefined, 'accessType')
          setAccessSelections(accessFilterItems.map((p) => p.value))
        } else {
          // none selected -> select
          await applyFilter(value, 'accessType')
          setAccessSelections([value])
        }
      }
    } else {
      if (isSelected) {
        if (serviceSelections.length > 1) {
          const otherValue = serviceFilterItems.find(
            (p) => p.value !== value
          ).value
          await applyFilter(otherValue, 'serviceType')
          setServiceSelections([otherValue])
        } else {
          await applyFilter(undefined, 'serviceType')
          setServiceSelections([])
        }
      } else {
        if (serviceSelections.length) {
          await applyFilter(undefined, 'serviceType')
          setServiceSelections(serviceFilterItems.map((p) => p.value))
        } else {
          await applyFilter(value, 'serviceType')
          setServiceSelections([value])
        }
      }
    }
  }

  async function applyClearFilter(addFiltersToUrl: boolean) {
    setServiceSelections([])
    setAccessSelections([])
    setServiceType(undefined)
    setAccessType(undefined)
    if (addFiltersToUrl) {
      let urlLocation = await addExistingParamsToUrl(location, [
        'accessType',
        'serviceType'
      ])
      urlLocation = `${urlLocation}`
      router.push(urlLocation)
    }
  }

  const styleClasses = cx({
    filterList: true,
    [className]: className
  })

  return (
    <div className={styleClasses}>
      <div>
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
      </div>
      <div>
        {accessFilterItems.map((e, index) => {
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
          const showClear =
            accessSelections.length > 0 || serviceSelections.length > 0
          return (
            <Button
              size="small"
              style="text"
              key={index}
              className={showClear ? styles.showClear : styles.hideClear}
              onClick={async () => {
                applyClearFilter(addFiltersToUrl)
              }}
            >
              {e.display}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
