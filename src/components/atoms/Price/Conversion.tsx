import React, { useEffect, useState, ReactElement } from 'react'
import styles from './Conversion.module.css'
import classNames from 'classnames/bind'
import { formatCurrency } from '@coingecko/cryptoformat'
import { useUserPreferences } from '../../../providers/UserPreferences'
import { usePrices } from '../../../providers/Prices'

const cx = classNames.bind(styles)

export default function Conversion({
  price,
  className
}: {
  price: string // expects price in OCEAN, not wei
  className?: string
}): ReactElement {
  const { prices } = usePrices()
  const { currency, locale } = useUserPreferences()

  const [priceConverted, setPriceConverted] = useState('0.00')

  const styleClasses = cx({
    conversion: true,
    [className]: className
  })

  useEffect(() => {
    if (!prices || !price || price === '0') {
      setPriceConverted('0.00')
      return
    }

    const fiatValue = (prices as any)[currency.toLowerCase()]
    const converted = fiatValue * Number(price)
    const convertedFormatted = formatCurrency(
      converted,
      currency,
      locale,
      true,
      { decimalPlaces: 2 }
    )
    setPriceConverted(convertedFormatted)
  }, [price, prices, currency, locale])

  return (
    <span
      className={styleClasses}
      title="Approximation based on current OCEAN spot price on Coingecko"
    >
      ≈ <strong>{priceConverted}</strong> {currency}
    </span>
  )
}
