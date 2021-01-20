import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import {
  addExistingParamsToUrl,
  SortTermOptions,
  SortValueOptions,
  FilterByPriceOptions
} from './utils'
import Button from '../../atoms/Button'
import sortStyles from './sort.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(sortStyles)

export default function Sort({
  sortType,
  setSortType,
  sortDirection,
  setSortDirection,
  setPriceType
}: {
  sortType: string
  setSortType: React.Dispatch<React.SetStateAction<string>>
  sortDirection: string
  setSortDirection: React.Dispatch<React.SetStateAction<string>>
  setPriceType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()
  async function sortResults(sortBy?: string, direction?: string) {
    let urlLocation: string
    if (sortBy) {
      urlLocation = await addExistingParamsToUrl(location, 'sort', 'priceType')
      urlLocation = `${urlLocation}&sort=${sortBy}`
      if (sortBy === SortTermOptions.Liquidity) {
        urlLocation = `${urlLocation}&priceType=${FilterByPriceOptions.Dynamic}`
        setPriceType(FilterByPriceOptions.Dynamic)
      } else {
        setPriceType(undefined)
      }
      setSortType(sortBy)
    } else if (direction) {
      urlLocation = await addExistingParamsToUrl(location, 'sortOrder')
      urlLocation = `${urlLocation}&sortOrder=${direction}`
      setSortDirection(direction)
    }
    navigate(urlLocation)
  }
  return (
    <div className={sortStyles.sortList}>
      <label className={sortStyles.sortLabel}>Sort</label>
      {[
        { display: 'Published', value: SortTermOptions.Created },
        { display: 'Liquidity', value: SortTermOptions.Liquidity },
        { display: 'Price', value: SortTermOptions.Price }
      ].map((e, index) => {
        const sorted = cx({
          [sortStyles.selected]: e.value === sortType,
          [sortStyles.sorted]: true
        })
        return (
          <div key={index}>
            <Button
              key={index}
              className={sorted}
              size="small"
              onClick={() => {
                if (e.value === sortType) {
                  if (sortDirection === SortValueOptions.Descending) {
                    sortResults(null, SortValueOptions.Ascending)
                  } else {
                    sortResults(null, SortValueOptions.Descending)
                  }
                } else {
                  sortResults(e.value, null)
                }
              }}
            >
              {e.display}
              {e.value === sortType ? (
                <div key={e.value}>
                  {sortDirection === SortValueOptions.Descending ? (
                    <label className={sortStyles.direction}>
                      {String.fromCharCode(9660)}
                    </label>
                  ) : (
                    <label className={sortStyles.direction}>
                      {String.fromCharCode(9650)}
                    </label>
                  )}
                </div>
              ) : null}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
