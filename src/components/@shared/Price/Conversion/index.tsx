import React, { useEffect, useState, ReactElement } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import { formatCurrency, isCrypto } from '@coingecko/cryptoformat'
import { Prices } from '@context/Prices'

const cx = classNames.bind(styles)

export interface ConversionProps {
  price: string // expects price in OCEAN, not wei
  className?: string
  hideApproximateSymbol?: boolean
  locale: string
  prices: Prices
  currency: string
}

export default function Conversion({
  price,
  className,
  hideApproximateSymbol,
  locale,
  prices,
  currency
}: ConversionProps): ReactElement {
  const [priceConverted, setPriceConverted] = useState('0.00')
  // detect fiat, only have those kick in full @coingecko/cryptoformat formatting
  const isFiat = !isCrypto(currency)
  // isCrypto() only checks for BTC & ETH & unknown but seems sufficient for now
  // const isFiat = /(EUR|USD|CAD|SGD|HKD|CNY|JPY|GBP|INR|RUB)/g.test(currency)

  const styleClasses = cx({
    conversion: true,
    [className]: className
  })

  useEffect(() => {
    if (!prices || !price || price === '0') {
      setPriceConverted('0.00')
      return
    }

    const conversionValue = prices[currency.toLowerCase()]
    const converted = conversionValue * Number(price)
    const convertedFormatted = formatCurrency(
      converted,
      // No passing of `currency` for non-fiat so symbol conversion
      // doesn't get triggered.
      isFiat ? currency : '',
      locale,
      false,
      { decimalPlaces: 2 }
    )
    // It's a hack! Wrap everything in the string which is not a number or `.` or `,`
    // with a span for consistent visual symbol formatting.
    const convertedFormattedHTMLstring = convertedFormatted.replace(
      /([^.,0-9]+)/g,
      (match) => `<span>${match}</span>`
    )
    setPriceConverted(convertedFormattedHTMLstring)
  }, [price, prices, currency, isFiat, locale])

  return (
    <span
      className={styleClasses}
      title="Approximation based on current OCEAN spot price on Coingecko"
    >
      {!hideApproximateSymbol && '≈ '}
      <strong dangerouslySetInnerHTML={{ __html: priceConverted }} />{' '}
      {!isFiat && currency}
    </span>
  )
}
