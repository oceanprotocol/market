import React from 'react'
import generalStyles from './index.module.css'
import filterStyles from './filterPrice.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(filterStyles)

export default ({
  priceType,
  setPriceType
}: {
  priceType: string
  setPriceType: React.Dispatch<React.SetStateAction<string>>
}) => (
  <div className={generalStyles.column}>
    <div className={generalStyles.description}>Filter by price: </div>
    {[
      { display: 'all', value: undefined },
      { display: 'fixed', value: 'fixed' },
      { display: 'dynamic', value: 'dynamic' }
    ].map((e, index) => {
      const filter = cx({
        [filterStyles.selected]: e.value === priceType,
        [filterStyles.filter]: true
      })
      return (
        <div
          key={index}
          className={filter}
          onClick={() => setPriceType(e.value)}
        >
          {e.display}
        </div>
      )
    })}
  </div>
)