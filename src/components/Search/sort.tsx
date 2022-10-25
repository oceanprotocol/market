import React, { ReactElement } from 'react'
import { addExistingParamsToUrl } from './utils'
import Button from '@shared/atoms/Button'
import styles from './sort.module.css'
import classNames from 'classnames/bind'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../@types/aquarius/SearchQuery'
import { useRouter } from 'next/router'

const cx = classNames.bind(styles)

const sortItems = [
  { display: 'Relevance', value: SortTermOptions.Relevance },
  { display: 'Published', value: SortTermOptions.Created },
  { display: 'Sales', value: SortTermOptions.Orders },
  { display: 'Total allocation', value: SortTermOptions.Allocated },
  { display: 'Price', value: SortTermOptions.Price }
]

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
  const router = useRouter()
  const directionArrow = String.fromCharCode(
    sortDirection === SortDirectionOptions.Ascending ? 9650 : 9660
  )
  async function sortResults(sortBy?: string, direction?: string) {
    let urlLocation: string
    if (sortBy) {
      urlLocation = await addExistingParamsToUrl(location, ['sort'])
      urlLocation = `${urlLocation}&sort=${sortBy}`
      setSortType(sortBy)
    } else if (direction) {
      urlLocation = await addExistingParamsToUrl(location, ['sortOrder'])
      urlLocation = `${urlLocation}&sortOrder=${direction}`
      setSortDirection(direction)
    }
    router.push(urlLocation)
  }
  function handleSortButtonClick(value: string) {
    if (value === sortType) {
      if (sortDirection === SortDirectionOptions.Descending) {
        sortResults(null, SortDirectionOptions.Ascending)
      } else {
        sortResults(null, SortDirectionOptions.Descending)
      }
    } else {
      sortResults(value, null)
    }
  }
  return (
    <div className={styles.sortList}>
      <label className={styles.sortLabel}>Sort</label>
      {sortItems.map((e, index) => {
        const sorted = cx({
          [styles.selected]: e.value === sortType,
          [styles.sorted]: true
        })
        return (
          <Button
            key={index}
            className={sorted}
            size="small"
            onClick={() => {
              handleSortButtonClick(e.value)
            }}
          >
            {e.display}
            {e.value === sortType ? (
              <span className={styles.direction}>{directionArrow}</span>
            ) : null}
          </Button>
        )
      })}
    </div>
  )
}
