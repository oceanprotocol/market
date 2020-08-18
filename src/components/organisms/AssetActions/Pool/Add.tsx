import React, { ReactElement } from 'react'
import styles from './Add.module.css'
import stylesIndex from './index.module.css'
import Button from '../../../atoms/Button'

export default function Add({
  setShowAdd
}: {
  setShowAdd: (show: boolean) => void
}): ReactElement {
  return (
    <div className={styles.add}>
      <Button
        className={stylesIndex.back}
        style="text"
        size="small"
        onClick={() => setShowAdd(false)}
      >
        ← Back
      </Button>
      <h3 className={stylesIndex.title}>Add Liquidity</h3>
    </div>
  )
}
