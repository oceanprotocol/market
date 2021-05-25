import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import {
  addExistingParamsToUrl,
  SortTermOptions,
  SortValueOptions
} from './utils'
import Button from '../../atoms/Button'
import {
  sorted,
  selected,
  sortList,
  sortLabel,
  direction
} from './sort.module.css'

const sortItems = [{ display: 'Published', value: SortTermOptions.Created }]

export default function Sort({
  sortType,
  setSortType,
  sortDirection,
  setSortDirection
}: {
  sortType: string
  setSortType: React.Dispatch<React.SetStateAction<string>>
  sortDirection: string
  setSortDirection: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()
  const directionArrow = String.fromCharCode(
    sortDirection === SortValueOptions.Ascending ? 9650 : 9660
  )
  async function sortResults(sortBy?: string, direction?: string) {
    let urlLocation: string
    if (sortBy) {
      urlLocation = `${urlLocation}&sort=${sortBy}`
      setSortType(sortBy)
    } else if (direction) {
      urlLocation = await addExistingParamsToUrl(location, 'sortOrder')
      urlLocation = `${urlLocation}&sortOrder=${direction}`
      setSortDirection(direction)
    }
    navigate(urlLocation)
  }
  function handleSortButtonClick(value: string) {
    if (value === sortType) {
      if (sortDirection === SortValueOptions.Descending) {
        sortResults(null, SortValueOptions.Ascending)
      } else {
        sortResults(null, SortValueOptions.Descending)
      }
    } else {
      sortResults(value, null)
    }
  }
  return (
    <div className={sortList}>
      <label className={sortLabel}>Sort</label>
      {sortItems.map((e, index) => (
        <Button
          key={index}
          className={`${sorted} ${e.value === sortType && selected}`}
          size="small"
          onClick={() => {
            handleSortButtonClick(e.value)
          }}
        >
          {e.display}
          {e.value === sortType ? (
            <span className={direction}>{directionArrow}</span>
          ) : null}
        </Button>
      ))}
    </div>
  )
}
