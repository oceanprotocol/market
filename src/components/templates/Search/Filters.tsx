import React, { ReactElement, useState } from 'react'
import { useNavigate } from '@reach/router'
import classNames from 'classnames/bind'
import {
  addExistingParamsToUrl,
  FilterByAccessOptions,
  FilterByTypeOptions
} from './utils'
import Button from '../../atoms/Button'
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

export default function Filters({
  serviceType,
  accessType,
  setServiceType,
  setAccessType,
  isSearch,
  className
}: {
  serviceType: string
  accessType: string
  setServiceType: React.Dispatch<React.SetStateAction<string>>
  isSearch: boolean
  setAccessType: React.Dispatch<React.SetStateAction<string>>
  className?: string
}): ReactElement {
  const navigate = useNavigate()
  const [serviceSelections, setServiceSelections] = useState<string[]>([])
  const [accessSelections, setAccessSelections] = useState<string[]>([])

  async function applyFilter(filter: string, filterType: string) {
    let urlLocation = ''
    if (filterType.localeCompare('accessType') === 0) {
      urlLocation = await addExistingParamsToUrl(location, ['accessType'])
    } else {
      urlLocation = await addExistingParamsToUrl(location, ['serviceType'])
    }

    async function applyServiceFilter(filterBy: string) {
      setServiceType(filterBy)
      if (filter && location.search.indexOf(filterType) === -1) {
        filterType === 'accessType'
          ? (urlLocation = `${urlLocation}&accessType=${filter}`)
          : (urlLocation = `${urlLocation}&serviceType=${filter}`)
      }

      if (isSearch) {
        let urlLocation = await addExistingParamsToUrl(location, [
          'serviceType'
        ])
        if (filterBy && location.search.indexOf('&serviceType') === -1) {
          urlLocation = `${urlLocation}&serviceType=${filterBy}`
        }
        filterType === 'accessType'
          ? setAccessType(filter)
          : setServiceType(filter)
        navigate(urlLocation)
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

    async function applyClearFilter(isSearch: boolean) {
      setServiceSelections([])
      setAccessSelections([])

      setServiceType(undefined)
      setAccessType(undefined)
      if (isSearch) {
        let urlLocation = await addExistingParamsToUrl(location, [
          'serviceType'
        ])
        urlLocation = `${urlLocation}`
        navigate(urlLocation)
      }
    }

    const styleClasses = cx({
      filterList: true,
      [className]: className
    })

    return (
      <div className={styleClasses}>
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
        <div className={styles.separator} />
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
                applyClearFilter(isSearch)
              }}
            >
              {e.display}
            </Button>
          )
        })}
      </div>
    )
  }
}
