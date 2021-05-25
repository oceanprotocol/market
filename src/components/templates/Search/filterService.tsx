import React, { ReactElement, useState } from 'react'
import { useNavigate } from '@reach/router'
import Button from '../../atoms/Button'
import { addExistingParamsToUrl, FilterByTypeOptions } from './utils'
import {
  showClear as showClearStyles,
  hideClear as hideClearStyles,
  filter as filterStyle,
  filterList,
  selected
} from './filterService.module.css'

const clearFilters = [{ display: 'Clear', value: '' }]

const serviceFilterItems = [
  { display: 'data sets', value: FilterByTypeOptions.Data },
  { display: 'algorithms', value: FilterByTypeOptions.Algorithm }
]

export default function FilterPrice({
  serviceType,
  setServiceType
}: {
  serviceType: string
  setServiceType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()
  const [serviceSelections, setServiceSelections] = useState<string[]>([])

  async function applyServiceFilter(filterBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, 'serviceType')
    if (filterBy && location.search.indexOf('&serviceType') === -1) {
      urlLocation = `${urlLocation}&serviceType=${filterBy}`
    }
    setServiceType(filterBy)
    navigate(urlLocation)
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

  async function applyClearFilter() {
    let urlLocation = await addExistingParamsToUrl(location, 'serviceType')

    urlLocation = `${urlLocation}`

    setServiceSelections([])
    setServiceType(undefined)
    navigate(urlLocation)
  }

  return (
    <div className={filterList}>
      {serviceFilterItems.map((e, index) => {
        const isServiceSelected =
          e.value === serviceType || serviceSelections.includes(e.value)
        return (
          <Button
            size="small"
            style="text"
            key={index}
            className={`${filterStyle} ${isServiceSelected && selected}`}
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
            className={showClear ? showClearStyles : hideClearStyles}
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
