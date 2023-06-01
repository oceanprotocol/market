import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import { addTokenToWallet } from '@utils/wallet'
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
  const styleClasses = cx({
    button: true,
    minimal,
    [className]: className
  })

  async function handleAddToken() {
    if (!window?.ethereum) return

    await addTokenToWallet(address, symbol)
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
