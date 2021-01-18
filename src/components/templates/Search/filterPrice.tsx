import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import generalStyles from './index.module.css'
import filterStyles from './filterPrice.module.css'
import classNames from 'classnames/bind'
import { addExistingParamsToUrl, FilterByPriceOptions } from './utils'
const cx = classNames.bind(filterStyles)

export default function FilterPrice({
  priceType,
  setPriceType
}: {
  priceType: string
  setPriceType: React.Dispatch<React.SetStateAction<string>>
}): ReactElement {
  const navigate = useNavigate()

  async function applyFilter(filterBy: string) {
    let urlLocation = await addExistingParamsToUrl(location, 'priceType')
    if (filterBy) {
      urlLocation = `${urlLocation}&priceType=${filterBy}`
    }
    navigate(urlLocation)
  }

  return (
    <div className={(generalStyles.column, filterStyles.filterList)}>
      <div className={generalStyles.description}>Filter by price: </div>
      {[
        { display: 'all', value: undefined },
        { display: 'fixed', value: FilterByPriceOptions.Fixed },
        { display: 'dynamic', value: FilterByPriceOptions.Dynamic }
      ].map((e, index) => {
        const filter = cx({
          [filterStyles.selected]: e.value === priceType,
          [filterStyles.filter]: true
        })
        return (
          <div
            key={index}
            className={filter}
            onClick={async () => {
              await applyFilter(e.value)
              setPriceType(e.value)
            }}
          >
            {e.display}
          </div>
        )
      })}
    </div>
  )
}
