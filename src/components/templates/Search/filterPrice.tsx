import React, { ReactElement } from 'react'
import { useNavigate } from '@reach/router'
import generalStyles from './index.module.css'
import filterStyles from './filterPrice.module.css'
import classNames from 'classnames/bind'
import { addExistingParamsToUrl, FilterByPriceOptions } from './utils'
import Button from '../../atoms/Button'
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
    setPriceType(filterBy)
    navigate(urlLocation)
  }

  return (
    <div>
      {[
        { display: 'all', value: undefined },
        { display: 'fixed price', value: FilterByPriceOptions.Fixed },
        { display: 'dynamic price', value: FilterByPriceOptions.Dynamic }
      ].map((e, index) => {
        const filter = cx({
          [filterStyles.selected]: e.value === priceType,
          [filterStyles.filter]: true
        })
        return (
          <Button
            size="small"
            key={index}
            className={filter}
            onClick={async () => {
              await applyFilter(e.value)
            }}
          >
            {e.display}
          </Button>
        )
      })}
    </div>
  )
}
