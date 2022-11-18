import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import { addTokenToWallet } from '@utils/web3'
import { useWeb3 } from '@context/Web3'
import Button from '@shared/atoms/Button'
import OceanLogo from '@images/logo.svg'
import styles from './index.module.css'

const cx = classNames.bind(styles)

export interface AddTokenProps {
  address: string
  symbol: string
  text?: string
  className?: string
  minimal?: boolean
}

export default function AddToken({
  address,
  symbol,
  text,
  className,
  minimal
}: AddTokenProps): ReactElement {
  const { web3Provider } = useWeb3()

  const styleClasses = cx({
    button: true,
    minimal,
    [className]: className
  })

  async function handleAddToken() {
    if (!web3Provider) return

    await addTokenToWallet(web3Provider, address, symbol)
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
          <OceanLogo />
        </div>
      </span>

      <span className={styles.text}>{text || `Add ${symbol}`}</span>
    </Button>
  )
}
