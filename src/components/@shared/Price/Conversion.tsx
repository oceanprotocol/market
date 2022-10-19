import React, { useEffect, useState, ReactElement } from 'react'
import styles from './Conversion.module.css'
import { formatCurrency, isCrypto } from '@coingecko/cryptoformat'
import { useUserPreferences } from '@context/UserPreferences'
import { usePrices, getCoingeckoTokenId } from '@context/Prices'

export default function Conversion({
  price,
  symbol,
  className,
  hideApproximateSymbol
}: {
  price: number // expects price in OCEAN, not wei
  symbol: string
  className?: string
  hideApproximateSymbol?: boolean
}): ReactElement {
  const { prices } = usePrices()
  const { currency, locale } = useUserPreferences()

  const [priceConverted, setPriceConverted] = useState('0')
  // detect fiat, only have those kick in full @coingecko/cryptoformat formatting
  const isFiat = !isCrypto(currency)
  // isCrypto() only checks for BTC & ETH & unknown but seems sufficient for now
  // const isFiat = /(EUR|USD|CAD|SGD|HKD|CNY|JPY|GBP|INR|RUB)/g.test(currency)

  // referring to Coingecko tokenId in Prices context provider
  const priceTokenId = getCoingeckoTokenId(symbol)

  useEffect(() => {
    if (!prices || !priceTokenId || !prices[priceTokenId]) {
      return
    }

    const conversionValue = prices[priceTokenId][currency.toLowerCase()]
    const converted = conversionValue * price
    const convertedFormatted = formatCurrency(
      converted,
      // No passing of `currency` for non-fiat so symbol conversion
      // doesn't get triggered.
      isFiat ? currency : '',
      locale,
      false,
      { decimalPlaces: price === 0 ? 0 : 2 }
    )
    // It's a hack! Wrap everything in the string which is not a number or `.` or `,`
    // with a span for consistent visual symbol formatting.
    const convertedFormattedHTMLstring = convertedFormatted.replace(
      /([^.,0-9]+)/g,
      (match) => `<span>${match}</span>`
    )
    setPriceConverted(convertedFormattedHTMLstring)
  }, [price, prices, currency, locale, isFiat, priceTokenId])

  return Number(price) >= 0 ? (
    <span
      className={`${styles.conversion} ${className || ''}`}
      title="Approximation based on the current spot price on Coingecko"
    >
      {!hideApproximateSymbol && '≈ '}
      <strong dangerouslySetInnerHTML={{ __html: priceConverted }} />{' '}
      {!isFiat && currency}
    </span>
  ) : null
}
