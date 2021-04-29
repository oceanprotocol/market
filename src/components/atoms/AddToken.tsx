import React, { ReactElement } from 'react'
import Button from '../atoms/Button'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import { addOceanToWallet } from '../../utils/web3'
import { useOcean } from '../../providers/Ocean'
import { useWeb3 } from '../../providers/Web3'

const cx = classNames.bind(styles)

export default function AddToken({
  className
}: {
  className?: string
}): ReactElement {
  const styleClasses = cx({
    publisher: true,
    [className]: className
  })
  const { web3Provider } = useWeb3()
  const { config } = useOcean()

  return (
    <div className={styleClasses}>
      <Button
        style="text"
        size="small"
        onClick={() => {
          addOceanToWallet(config, web3Provider)
        }}
      >
        {`Add ${config.oceanTokenSymbol}`}
      </Button>
    </div>
  )
}
