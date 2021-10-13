import React, { ReactElement } from 'react'
import { formatCurrency } from '@coingecko/cryptoformat'
import classNames from 'classnames/bind'
import Conversion from './Conversion'
import styles from './PriceUnit.module.css'
import { useUserPreferences } from '@context/UserPreferences'
<<<<<<< HEAD:src/components/@shared/Price/PriceUnit.tsx
import Badge from '@shared/atoms/Badge'
=======
import Badge from '../Badge'
>>>>>>> 14d71ad2 (reorganize all the things):src/components/@shared/atoms/Price/PriceUnit.tsx

const cx = classNames.bind(styles)

export function formatPrice(price: string, locale: string): string {
  return formatCurrency(Number(price), '', locale, false, {
    // Not exactly clear what `significant figures` are for this library,
    // but setting this seems to give us the formatting we want.
    // See https://github.com/oceanprotocol/market/issues/70
    significantFigures: 4
  })
}

export default function PriceUnit({
  price,
  className,
  small,
  conversion,
  symbol,
  type
}: {
  price: string
  type?: string
  className?: string
  small?: boolean
  conversion?: boolean
  symbol?: string
}): ReactElement {
  const { locale } = useUserPreferences()

  const styleClasses = cx({
    price: true,
    small: small,
    [className]: className
  })

  return (
    <div className={styleClasses}>
      {type && type === 'free' ? (
        <div> Free </div>
      ) : (
        <>
          <div>
            {Number.isNaN(Number(price)) ? '-' : formatPrice(price, locale)}{' '}
            <span className={styles.symbol}>{symbol}</span>
            {type && type === 'pool' && (
              <Badge label="pool" className={styles.badge} />
            )}
          </div>
          {conversion && <Conversion price={price} />}
        </>
      )}
    </div>
  )
}
