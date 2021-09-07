import React, { ReactElement, useState } from 'react'
import { useNavigate } from '@reach/router'
import classNames from 'classnames/bind'
import { addExistingParamsToUrl, FilterByTypeOptions } from './utils'
import Button from '../../atoms/Button'
import styles from './Filters.module.css'

const cx = classNames.bind(styles)

const clearFilters = [{ display: 'Clear', value: '' }]

const serviceFilterItems = [
  { display: 'data sets', value: FilterByTypeOptions.Data },
  { display: 'algorithms', value: FilterByTypeOptions.Algorithm }
]

export default function Filters({
  serviceType,
  setServiceType,
  isSearch,
  className
}: {
  serviceType: string
  setServiceType: React.Dispatch<React.SetStateAction<string>>
  isSearch: boolean
  className?: string
}): ReactElement {
  const navigate = useNavigate()
  const [serviceSelections, setServiceSelections] = useState<string[]>([])

  async function applyServiceFilter(filterBy: string) {
    setServiceType(filterBy)
    if (isSearch) {
      let urlLocation = await addExistingParamsToUrl(location, ['serviceType'])
      if (filterBy && location.search.indexOf('&serviceType') === -1) {
        urlLocation = `${urlLocation}&serviceType=${filterBy}`
      }
      navigate(urlLocation)
    }
  }

  async function handleSelectedFilter(isSelected: boolean, value: string) {
    if (isSelected) {
      if (serviceSelections.length > 1) {
        const otherValue = serviceFilterItems.find(
          (p) => p.value !== value
        ).value
        await applyServiceFilter(otherValue)
        setServiceSelections([otherValue])
      } else {
        await applyServiceFilter(undefined)
        if (serviceSelections.includes(value)) {
          serviceSelections.pop()
        }
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

  async function applyClearFilter(isSearch: boolean) {
    setServiceSelections([])
    setServiceType(undefined)
    if (isSearch) {
      let urlLocation = await addExistingParamsToUrl(location, ['serviceType'])
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
      {clearFilters.map((e, index) => {
        const showClear = serviceSelections.length > 0
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
