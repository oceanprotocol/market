import React, { ReactElement, useEffect, useState } from 'react'
import { useOcean, useMetadata, usePricing } from '@oceanprotocol/react'
import { DDO } from '@oceanprotocol/lib'
import styles from './index.module.css'


import TradeInput from './TradeInput'
import Button from '../../../atoms/Button'
import { ReactComponent as Arrow } from '../../../../images/arrowDown.svg'
import { TradeLiquidity, TradeValue } from '.'
import { FormikContextType, useFormikContext } from 'formik'

export default function TradeForm({ ddo }: { ddo: DDO }): ReactElement {
  const [buyValue, setBuyValue] = useState<TradeValue>()
  const [sellValue, setSellValue] = useState<TradeValue>()
  const { dtSymbol } = usePricing(ddo)

  useEffect(()=>{
    setBuyValue({amount:0, token:'OCEAN',maxAmount:0})
    setSellValue({amount:0, token:dtSymbol,maxAmount:0})
  },[ddo,dtSymbol])

  const swapTokens= ()=>{
      const tempVal = buyValue
      setBuyValue(sellValue)
      setSellValue(tempVal)
  }
  return (
    <>
      <div className={styles.tradeInput}>
        <TradeInput name="sellToken" value={sellValue}/>
      </div>
      <div className={styles.swapButton}>
        <Button style="text" onClick={swapTokens}>
          <Arrow />
        </Button>
      </div>
      <div className={styles.tradeInput}>
        <TradeInput name="buyToken" value={buyValue} />
      </div>
    </>
  )
}
