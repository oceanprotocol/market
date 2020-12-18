import React from 'react'
import generalStyles from './index.module.css'
import styles from './filter.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

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
        [styles.selected]: e.value === priceType,
        [styles.filter]: true
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
