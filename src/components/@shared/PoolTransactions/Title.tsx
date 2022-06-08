import React, { useState, useEffect, ReactElement } from 'react'
import { PoolTransaction } from '.'
import { useUserPreferences } from '@context/UserPreferences'
import ExplorerLink from '@shared/ExplorerLink'
import { formatPrice } from '@shared/Price/PriceUnit'
import styles from './Title.module.css'

function getTitle(row: PoolTransaction, locale: string) {
  let title = ''

  switch (row.type) {
    case 'SWAP': {
      const { datatoken, baseToken, datatokenValue, baseTokenValue } = row

      const outToken =
        (datatokenValue < 0 && datatoken) || (baseTokenValue < 0 && baseToken)
      const outTokenValue =
        (datatokenValue < 0 && datatokenValue) ||
        (baseTokenValue < 0 && baseTokenValue)
      const outTokenSymbol = outToken?.symbol

      const inToken =
        (datatokenValue > 0 && datatoken) || (baseTokenValue > 0 && baseToken)
      const inTokenValue =
        (datatokenValue > 0 && datatokenValue) ||
        (baseTokenValue > 0 && baseTokenValue)
      const inTokenSymbol = inToken?.symbol

      title += `Swap ${formatPrice(
        Math.abs(inTokenValue).toString(),
        locale
      )}${inTokenSymbol} for ${formatPrice(
        Math.abs(outTokenValue).toString(),
        locale
      )}${outTokenSymbol}`

      break
    }
    case 'SETUP': {
      const firstToken = row.baseToken
      const firstTokenSymbol = firstToken?.symbol
      title += `Create pool with ${formatPrice(
        Math.abs(row.baseTokenValue).toString(),
        locale
      )}${firstTokenSymbol}`
      break
    }
    case 'JOIN':
    case 'EXIT': {
      const tokenMoved =
        Math.abs(row.baseTokenValue) > 0 ? row.baseToken : row.datatoken
      const tokenValueMoved =
        Math.abs(row.baseTokenValue) > 0
          ? row.baseTokenValue
          : row.datatokenValue
      const tokenSymbol = tokenMoved.symbol

      title += `${row.type === 'JOIN' ? 'Add' : 'Remove'} ${formatPrice(
        Math.abs(tokenValueMoved).toString(),
        locale
      )}${tokenSymbol}`

      break
    }
  }

  return title
}

export default function Title({ row }: { row: PoolTransaction }): ReactElement {
  const [title, setTitle] = useState<string>()
  const { locale } = useUserPreferences()

  useEffect(() => {
    if (!locale || !row) return

    const title = getTitle(row, locale)
    setTitle(title)
  }, [row, locale])

  return title ? (
    <ExplorerLink networkId={row.networkId} path={`/tx/${row.tx}`}>
      <span className={styles.titleText}>{title}</span>
    </ExplorerLink>
  ) : null
}
