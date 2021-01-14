import React, { ReactElement, useState, useEffect } from 'react'
import generalStyles from './index.module.css'
import filterStyles from './filterPrice.module.css'
import classNames from 'classnames/bind'
import queryString from 'query-string'
const cx = classNames.bind(filterStyles)
import { useNavigate } from '@reach/router'

export default function FilterPrice ({
  priceType,
  setPriceType
}: {
  priceType: string
  setPriceType: React.Dispatch<React.SetStateAction<string>>
}) : ReactElement {
    const navigate = useNavigate()

    function applyFilter(filterBy: string) {
        const parsed = queryString.parse(location.search)
        let urlLocation = '/search?'
        for (let querryParam in parsed) {
            if(querryParam !== 'priceType'){
                let value = parsed[querryParam];
                urlLocation = `${urlLocation}${querryParam}=${value}&`
            }
        }
        if (filterBy){
            urlLocation = `${urlLocation}priceType=${filterBy}`
        } else {
            urlLocation = urlLocation.slice(0, -1); 
        } 
        console.log('filterBy ',filterBy)
        console.log('urlLocation ',urlLocation)
        navigate(urlLocation)
    }
    return (
        <div className={generalStyles.column, filterStyles.filterList}>
            <div className={generalStyles.description}>Filter by price: </div>
                {[
                    { display: 'all', value: undefined },
                    { display: 'fixed', value: 'exchange' },
                    { display: 'dynamic', value: 'pool' }
                ].map((e, index) => {
                    const filter = cx({
                        [filterStyles.selected]: e.value === priceType,
                        [filterStyles.filter]: true
                     })
                return (
                    <div
                        key={index}
                        className={filter}
                        onClick={() => {
                            applyFilter(e.value) 
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