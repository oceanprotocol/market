import React from 'react'
import generalStyles from './index.module.css'
import sortStyles from './sort.module.css'
import classNames from 'classnames/bind'
import queryString from 'query-string'
const cx = classNames.bind(sortStyles)

export default ({
    sortType,
    setSortType
}: {
    sortType: string
    setSortType: React.Dispatch<React.SetStateAction<string>>
}) => (
  <div className={generalStyles.column}>
    <div className={generalStyles.description}>Sort by: </div>
    {[
      { display: 'Liquidity', value: 'liquidity' },
      { display: 'Price', value: 'price' },
      { display: 'Created', value: 'created' }
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
            }}
        >
          {e.display}
        </div>
      )
    })}
  </div>
)