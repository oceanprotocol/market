import React, { useEffect, useState, ReactElement } from 'react'
import useSWR from 'swr'
import { fetchData, isBrowser } from '../../../utils'
import styles from './Conversion.module.css'
import classNames from 'classnames/bind'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

const cx = classNames.bind(styles)

export default function Conversion({
  price,
  className
}: {
  price: string // expects price in OCEAN, not wei
  className?: string
}): ReactElement {
  const { appConfig } = useSiteMetadata()
  const tokenId = 'ocean-protocol'
  const currencies = appConfig.currencies.join(',') // comma-separated list
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${currencies}&include_24hr_change=true`
  const { currency, locale } = useUserPreferences()

  const [priceConverted, setPriceConverted] = useState('0.00')

  const styleClasses = cx({
    conversion: true,
    [className]: className
  })

  const onSuccess = async (data: { [tokenId]: { [key: string]: number } }) => {
    if (!data) return
    if (!price || price === '' || price === '0') {
      setPriceConverted('0.00')
      return
    }

    const values = data[tokenId]
    const fiatValue = values[currency.toLowerCase()]
    const converted = fiatValue * Number(price)
    const convertedFormatted = formatCurrency(
      converted,
      currency,
      locale,
      true,
      { decimalPlaces: 2 }
    )
    setPriceConverted(convertedFormatted)
  }

  useEffect(() => {
    async function getData() {
      const data = await fetchData(url)
      await onSuccess(data)
    }
    if (isBrowser && price !== '0') {
      getData()
    }
  }, [price, currency, url])

  // Fetch new prices periodically with swr
  useSWR(url, fetchData, {
    refreshInterval: 30000, // 30 sec.
    onSuccess
  })

  return (
    <span
      className={styleClasses}
      title="Approximation based on current spot price on Coingecko"
    >
      ≈ {priceConverted} {currency}
    </span>
  )
}
