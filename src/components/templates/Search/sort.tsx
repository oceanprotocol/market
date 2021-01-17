import React, { ReactElement, useState, useEffect } from 'react'
import Tooltip from '../../atoms/Tooltip'
import generalStyles from './index.module.css'
import sortStyles from './sort.module.css'
import classNames from 'classnames/bind'
import queryString from 'query-string'
const cx = classNames.bind(sortStyles)
import { useNavigate } from '@reach/router'

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

  function changeSortDirection(direction: string) {
    const parsed = queryString.parse(location.search)
    let urlLocation = '/search?'
    for (let querryParam in parsed) {
      if (querryParam !== 'sortOrder') {
        let value = parsed[querryParam]
        urlLocation = `${urlLocation}${querryParam}=${value}&`
      }
    }
    if (direction) {
      urlLocation = `${urlLocation}sortOrder=${direction}`
    } else {
      urlLocation = urlLocation.slice(0, -1)
    }
    console.log('sortOrder ', direction)
    console.log('urlLocation ', urlLocation)
    navigate(urlLocation)
  }

  function applySort(sortBy: string) {
    const parsed = queryString.parse(location.search)
    let urlLocation = '/search?'
    for (let querryParam in parsed) {
      if (querryParam !== 'sort') {
        let value = parsed[querryParam]
        urlLocation = `${urlLocation}${querryParam}=${value}&`
      }
    }
    if (sortBy) {
      urlLocation = `${urlLocation}sort=${sortBy}`
    } else {
      urlLocation = urlLocation.slice(0, -1)
    }
    console.log('sortBy ', sortBy)
    console.log('urlLocation ', urlLocation)
    navigate(urlLocation)
  }

  return (
    <div className={(generalStyles.column, sortStyles.sortList)}>
      <div className={generalStyles.description}>Sort by: </div>
      {[
        { display: 'Published', value: 'created' },
        { display: 'Liquidity', value: 'liquidity' },
        { display: 'Price', value: 'price' }
      ].map((e, index) => {
        const sorted = cx({
          [sortStyles.selected]: e.value === sortType,
          [sortStyles.sorted]: true
        })
        return (
          <div>
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
                    {sortDirection === 'desc' ? (
                      <button
                        onClick={(e) => {
                          changeSortDirection('asc')
                          setSortDirection('asc')
                        }}
                        className={sortStyles.direction}
                        key={e.value + ' dir'}
                      >
                        {String.fromCharCode(9660)}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          changeSortDirection('desc')
                          setSortDirection('desc')
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
