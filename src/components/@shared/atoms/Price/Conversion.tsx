import React, { useEffect, useState, ReactElement } from 'react'
import styles from './Conversion.module.css'
import classNames from 'classnames/bind'
import { formatCurrency, isCrypto } from '@coingecko/cryptoformat'
import { useUserPreferences } from '@context/UserPreferences'
import { usePrices } from '@context/Prices'

const cx = classNames.bind(styles)

export default function Conversion({
  price,
  className,
  hideApproximateSymbol,
  showTVLLabel
}: {
  price: string // expects price in OCEAN, not wei
  className?: string
  hideApproximateSymbol?: boolean
  showTVLLabel?: boolean
}): ReactElement {
  const { prices } = usePrices()
  const { currency, locale } = useUserPreferences()

  const [priceConverted, setPriceConverted] = useState('0.00')
  // detect fiat, only have those kick in full @coingecko/cryptoformat formatting
  const isFiat = !isCrypto(currency)
  // isCrypto() only checks for BTC & ETH & unknown but seems sufficient for now
  // const isFiat = /(EUR|USD|CAD|SGD|HKD|CNY|JPY|GBP|INR|RUB)/g.test(currency)

  const styleClasses = cx({
    conversion: true,
    removeTvlPadding: showTVLLabel,
    [className]: className
  })

  useEffect(() => {
    if (!prices || !price || price === '0') {
      setPriceConverted('0.00')
      return
    }

    const conversionValue = (prices as any)[currency.toLowerCase()]
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
  }, [price, prices, currency, locale, isFiat])

  return (
    <span
      className={styleClasses}
      title="Approximation based on current OCEAN spot price on Coingecko"
    >
      {showTVLLabel && 'TVL'}
      {!hideApproximateSymbol && '≈ '}
      <strong dangerouslySetInnerHTML={{ __html: priceConverted }} />{' '}
      {!isFiat && currency}
    </span>
  )
}
