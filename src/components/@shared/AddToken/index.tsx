import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import { addTokenToWallet } from '@utils/web3'
import Button from '@shared/atoms/Button'
import styles from './index.module.css'
import { IProviderInfo } from 'web3modal'

const cx = classNames.bind(styles)

export interface AddTokenProps {
  address: string
  symbol: string
  logo: string // needs to be a remote image
  text?: string
  className?: string
  minimal?: boolean
  web3Provider?: IProviderInfo
}

export default function AddToken({
  address,
  symbol,
  logo,
  text,
  className,
  minimal,
  web3Provider
}: AddTokenProps): ReactElement {
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
        <img src={logo} className={styles.logo} width="16" height="16" />
      </span>

      <span className={styles.text}>{text || `Add ${symbol}`}</span>
    </Button>
  )
}
