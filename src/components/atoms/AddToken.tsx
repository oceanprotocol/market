import React, { ReactElement } from 'react'
import { addTokenToWallet } from '../../utils/web3'
import { useWeb3 } from '../../providers/Web3'
import Button from './Button'
import {
  logoWrap,
  logo as styleLogo,
  text as styleText,
  minimal as styleMinimal,
  button
} from './AddToken.module.css'

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
  logo: string // needs to be a remote image
  text?: string
  className?: string
  minimal?: boolean
}): ReactElement {
  const { web3Provider } = useWeb3()

  const styleClasses = `${button} ${minimal && styleMinimal} ${className}`

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
      <span className={logoWrap}>
        <img src={logo} className={styleLogo} width="16" height="16" />
      </span>

      <span className={styleText}>{text || `Add ${symbol}`}</span>
    </Button>
  )
}
