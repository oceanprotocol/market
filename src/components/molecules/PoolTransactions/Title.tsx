import React, { useState, useEffect, ReactElement } from 'react'
import { PoolTransaction } from '.'
import { useUserPreferences } from '../../../providers/UserPreferences'
import ExplorerLink from '../../atoms/ExplorerLink'
import { formatPrice } from '../../atoms/Price/PriceUnit'
import styles from './Title.module.css'

async function getTitle(row: PoolTransaction, locale: string) {
  let title = ''
  switch (row.event) {
    case 'swap': {
      const inToken = row.tokens.filter((x) => x.type === 'in')[0]
      const inTokenSymbol = inToken?.poolToken.symbol
      const outToken = row.tokens.filter((x) => x.type === 'out')[0]
      const outTokenSymbol = outToken?.poolToken.symbol
      title += `Swap ${formatPrice(
        Math.abs(inToken?.value).toString(),
        locale
      )}${inTokenSymbol} for ${formatPrice(
        Math.abs(outToken?.value).toString(),
        locale
      )}${outTokenSymbol}`

      break
    }
    case 'setup': {
      const firstToken = row.tokens.filter(
        (x) =>
          x.tokenAddress.toLowerCase() !==
          row.poolAddress.datatokenAddress.toLowerCase()
      )[0]
      const firstTokenSymbol = firstToken?.poolToken.symbol
      const secondToken = row.tokens.filter(
        (x) =>
          x.tokenAddress.toLowerCase() ===
          row.poolAddress.datatokenAddress.toLowerCase()
      )[0]
      const secondTokenSymbol = secondToken?.poolToken.symbol
      title += `Create pool with ${formatPrice(
        Math.abs(firstToken.value).toString(),
        locale
      )}${firstTokenSymbol} and ${formatPrice(
        Math.abs(secondToken.value).toString(),
        locale
      )}${secondTokenSymbol}`
      break
    }
    case 'join':
    case 'exit': {
      for (let i = 0; i < row.tokens.length; i++) {
        const tokenSymbol = row.tokens[i].poolToken.symbol
        if (i > 0) title += '\n'
        title += `${row.event === 'join' ? 'Add' : 'Remove'} ${formatPrice(
          Math.abs(row.tokens[i].value).toString(),
          locale
        )}${tokenSymbol}`
      }
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
    async function init() {
      const title = await getTitle(row, locale)
      setTitle(title)
    }
    init()
  }, [row, locale])

  return title ? (
    <ExplorerLink networkId={row.networkId} path={`/tx/${row.tx}`}>
      <span className={styles.titleText}>{title}</span>
    </ExplorerLink>
  ) : null
}
