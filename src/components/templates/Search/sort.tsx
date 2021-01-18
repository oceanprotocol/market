import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import Tooltip from '../../atoms/Tooltip'
import {
  addExistingParamsToUrl,
  SortTermOptions,
  SortValueOptions
} from './utils'
import generalStyles from './index.module.css'
import sortStyles from './sort.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(sortStyles)

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

  async function changeSortDirection(direction: string) {
    let urlLocation = await addExistingParamsToUrl(location, 'sortOrder')
    if (direction) {
      urlLocation = `${urlLocation}&sortOrder=${direction}`
    }
    navigate(urlLocation)
  }

  async function applySort(sortBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, 'sort')
    if (sortBy) {
      urlLocation = `${urlLocation}&sort=${sortBy}`
    }
    navigate(urlLocation)
  }

  return (
    <div className={(generalStyles.column, sortStyles.sortList)}>
      <div className={generalStyles.description}>Sort by: </div>
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
            <div
              key={index}
              className={sorted}
              onClick={() => {
                setSortType(e.value)
                applySort(e.value)
              }}
            >
              {e.display}
              {e.value === sortType ? (
                <div key={e.value}>
                  <Tooltip
                    content="click to change direction"
                    placement="bottom"
                    key={e.value + ' tlt'}
                  >
                    {sortDirection === SortValueOptions.Descending ? (
                      <button
                        onClick={(e) => {
                          changeSortDirection(SortValueOptions.Ascending)
                          setSortDirection(SortValueOptions.Ascending)
                        }}
                        className={sortStyles.direction}
                        key={e.value + ' dir'}
                      >
                        {String.fromCharCode(9660)}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          changeSortDirection(SortValueOptions.Descending)
                          setSortDirection(SortValueOptions.Descending)
                        }}
                        className={sortStyles.direction}
                        key={e.value + ' dir'}
                      >
                        {String.fromCharCode(9650)}
                      </button>
                    )}
                  </Tooltip>
                </div>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
