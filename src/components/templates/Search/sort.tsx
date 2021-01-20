import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import {
  addExistingParamsToUrl,
  SortTermOptions,
  SortValueOptions
} from './utils'
import Button from '../../atoms/Button'
import styles from './sort.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const sortItems = [
  { display: 'Published', value: SortTermOptions.Created },
  { display: 'Liquidity', value: SortTermOptions.Liquidity },
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
  const navigate = useNavigate()
  async function sortResults(sortBy?: string, direction?: string) {
    let urlLocation: string
    if (sortBy) {
      urlLocation = await addExistingParamsToUrl(location, 'sort')
      urlLocation = `${urlLocation}&sort=${sortBy}`
    } else if (direction) {
      urlLocation = await addExistingParamsToUrl(location, 'sortOrder')
      urlLocation = `${urlLocation}&sortOrder=${direction}`
    }
    navigate(urlLocation)
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
              if (e.value === sortType) {
                if (sortDirection === SortValueOptions.Descending) {
                  sortResults(null, SortValueOptions.Ascending)
                  setSortDirection(SortValueOptions.Ascending)
                } else {
                  sortResults(null, SortValueOptions.Descending)
                  setSortDirection(SortValueOptions.Descending)
                }
              } else {
                setSortType(e.value)
                sortResults(e.value, null)
              }
            }}
          >
            {e.display}
            {e.value === sortType ? (
              sortDirection === SortValueOptions.Descending ? (
                <span className={styles.direction}>
                  {String.fromCharCode(9660)}
                </span>
              ) : (
                <span className={styles.direction}>
                  {String.fromCharCode(9650)}
                </span>
              )
            ) : null}
          </Button>
        )
      })}
    </div>
  )
}
