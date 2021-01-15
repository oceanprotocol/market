import React, { ReactElement, useState, useEffect } from 'react'
import generalStyles from './index.module.css'
import sortStyles from './sort.module.css'
import classNames from 'classnames/bind'
import queryString from 'query-string'
const cx = classNames.bind(sortStyles)
import { useNavigate } from '@reach/router'

export default function Sort({
  sortType,
  setSortType
}: {
  sortType: string
  setSortType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()

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
          <div
            key={index}
            className={sorted}
            onClick={() => {
              setSortType(e.value)
              applySort(e.value)
            }}
          >
            {e.display}
          </div>
        )
      })}
    </div>
  )
}
