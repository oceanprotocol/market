import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import { addTokenToWallet } from '@utils/web3'
import { useWeb3 } from '@context/Web3'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import TokenLogo from '@shared/atoms/TokenLogo'

const cx = classNames.bind(styles)

export default function AddToken({
  address,
  symbol,
  logo,
  text,
  className,
  minimal
}: {
  address: string
  symbol: string
  logo: string
  text?: string
  className?: string
  minimal?: boolean
}): ReactElement {
  const { web3Provider } = useWeb3()

  const styleClasses = cx({
    button: true,
    minimal,
    [className]: className
  })

  async function handleAddToken() {
    if (!web3Provider) return

    await addTokenToWallet(web3Provider, address, symbol, logo)
  }

  return (
    <Button
      className={styleClasses}
      style="text"
      size="small"
      onClick={handleAddToken}
    >
      <span className={styles.logoWrap}>
        <div className={styles.logo}>
          <TokenLogo tokenLogoKey={logo} />
        </div>
      </span>

      <span className={styles.text}>{text || `Add ${symbol}`}</span>
    </Button>
  )
}
