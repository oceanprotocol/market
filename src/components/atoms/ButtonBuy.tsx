import React, { FormEvent, ReactElement } from 'react'
import Button from './Button'
import styles from './ButtonBuy.module.css'
import Loader from './Loader'

interface ButtonBuyProps {
  action: 'download' | 'compute'
  disabled: boolean
  hasPreviousOrder: boolean
  hasDatatoken: boolean
  dtSymbol: string
  dtBalance: string
  isLoading: boolean
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
  assetTimeout?: string
  stepText?: string
  type?: 'submit'
}

function getHelpText(
  token: {
    dtBalance: string
    dtSymbol: string
  },
  hasDatatoken: boolean,
  hasPreviousOrder: boolean,
  timeout: string
) {
  const { dtBalance, dtSymbol } = token
  const assetTimeout = timeout === 'Forever' ? '' : ` for ${timeout}`
  const text = hasPreviousOrder
    ? `You bought this data set already allowing you to use it without paying again${assetTimeout}.`
    : hasDatatoken
    ? `You own ${dtBalance} ${dtSymbol} allowing you to use this data set by spending 1 ${dtSymbol}, but without paying OCEAN again.`
    : `For using this data set, you will buy 1 ${dtSymbol} and immediately spend it back to the publisher and pool.`

  return text
}

export default function ButtonBuy({
  action,
  disabled,
  hasPreviousOrder,
  hasDatatoken,
  dtSymbol,
  dtBalance,
  onClick,
  assetTimeout,
  stepText,
  isLoading,
  type
}: ButtonBuyProps): ReactElement {
  const buttonText =
    action === 'download'
      ? hasPreviousOrder
        ? 'Download'
        : `Buy ${assetTimeout === 'Forever' ? '' : ` for ${assetTimeout}`}`
      : hasPreviousOrder
      ? 'Start Compute Job'
      : 'Buy Compute Job'

  return (
    <div className={styles.actions}>
      {isLoading ? (
        <Loader message={stepText} />
      ) : (
        <>
          <Button
            style="primary"
            type={type}
            onClick={onClick}
            disabled={disabled}
          >
            {buttonText}
          </Button>
          <div className={styles.help}>
            {getHelpText(
              { dtBalance, dtSymbol },
              hasDatatoken,
              hasPreviousOrder,
              assetTimeout
            )}
          </div>
        </>
      )}
    </div>
  )
}
