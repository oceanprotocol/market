import React, { ReactElement } from 'react'
import FormHelp from '@shared/FormInput/Help'
import Token from '../../../../@shared/Token'
import styles from './Output.module.css'
import content from '../../../../../../content/price.json'
import { usePool } from '@context/Pool'

export default function Output({
  newPoolTokens,
  newPoolShare
}: {
  newPoolTokens: string
  newPoolShare: string
}): ReactElement {
  const { help, titleIn } = content.pool.add.output
  const { poolInfo } = usePool()

  return (
    <>
      <FormHelp className={styles.help}>
        {help.replace('SWAPFEE', poolInfo?.liquidityProviderSwapFee)}
      </FormHelp>
      <div className={styles.output}>
        <p>{titleIn}</p>
        <Token symbol="pool shares" balance={newPoolTokens} noIcon />
        <Token symbol="% of pool" balance={newPoolShare} noIcon />
      </div>
    </>
  )
}
