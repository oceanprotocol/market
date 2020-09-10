import React, { useEffect, useState, ReactElement } from 'react'
import useSWR from 'swr'
import { fetchData, isBrowser } from '../../../utils'
import styles from './Conversion.module.css'
import classNames from 'classnames/bind'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'

const cx = classNames.bind(styles)

const currencies = 'EUR,USD' // comma-separated list
const url = `https://api.coingecko.com/api/v3/simple/price?ids=ocean-protocol&vs_currencies=${currencies}&include_24hr_change=true`

export default function Conversion({
  price,
  update = true,
  className
}: {
  price: string // expects price in OCEAN, not wei
  update?: boolean
  className?: string
}): ReactElement {
  const [priceFiat, setPriceFiat] = useState('0.00')
  const { currency } = useUserPreferences()

  const styleClasses = cx({
    conversion: true,
    [className]: className
  })

  const onSuccess = async (data: {
    'ocean-protocol': { eur: number; usd: number }
  }) => {
    if (!data) return
    if (!price || price === '' || price === '0') {
      setPriceFiat('0.00')
      return
    }

    const { eur, usd } = data['ocean-protocol']
    const fiatValue = currency === 'EUR' ? eur : usd
    const converted = fiatValue * Number(price)
    setPriceFiat(`${formatCurrency(converted, currency, undefined, true)}`)
  }

  useEffect(() => {
    async function getData() {
      const data = await fetchData(url)
      await onSuccess(data)
    }
    if (isBrowser && price !== '0') {
      getData()
    }
  }, [price, currency])

  if (update) {
    // Fetch new prices periodically with swr
    useSWR(url, fetchData, {
      refreshInterval: 30000, // 30 sec.
      onSuccess
    })
  }

  return (
    <span
      className={styleClasses}
      title="Approximation based on current spot price on Coingecko"
    >
      ≈ {priceFiat} {currency}
    </span>
  )
}
