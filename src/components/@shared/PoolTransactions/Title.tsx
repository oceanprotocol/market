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
      const { datatoken, baseToken } = row
      const outToken =
        (datatoken.value < 0 && datatoken.value) ||
        (baseToken.value < 0 && baseToken.value)
      const outTokenSymbol = outToken?.token.symbol

      const inToken =
        (datatoken.value > 0 && datatoken.value) ||
        (baseToken.value > 0 && baseToken.value)
      const inTokenSymbol = inToken?.token.symbol

      title += `Swap ${formatPrice(
        Math.abs(inToken?.value).toString(),
        locale
      )}${inTokenSymbol} for ${formatPrice(
        Math.abs(outToken?.value).toString(),
        locale
      )}${outTokenSymbol}`

      break
    }
    case 'SETUP': {
      const firstToken = row.baseToken
      const firstTokenSymbol = firstToken?.token.symbol
      const secondToken = row.datatoken
      const secondTokenSymbol = secondToken?.token.symbol
      title += `Create pool with ${formatPrice(
        Math.abs(firstToken?.value).toString(),
        locale
      )}${firstTokenSymbol} and ${formatPrice(
        Math.abs(secondToken?.value).toString(),
        locale
      )}${secondTokenSymbol}`
      break
    }
    case 'JOIN':
    case 'EXIT': {
      const tokenMoved = row.baseToken.value > 0 ? row.baseToken : row.datatoken
      const tokenSymbol = tokenMoved.token.symbol

      title += `${row.type === 'JOIN' ? 'Add' : 'Remove'} ${formatPrice(
        Math.abs(tokenMoved.value).toString(),
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
