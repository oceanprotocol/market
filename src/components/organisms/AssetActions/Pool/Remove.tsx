import React, { ReactElement } from 'react'
import styles from './Remove.module.css'
import stylesIndex from './index.module.css'
import Button from '../../../atoms/Button'

export default function Remove({
  setShowRemove
}: {
  setShowRemove: (show: boolean) => void
}): ReactElement {
  return (
    <div className={styles.remove}>
      <Button
        className={stylesIndex.back}
        style="text"
        size="small"
        onClick={() => setShowRemove(false)}
      >
        ← Back
      </Button>
      <h3 className={stylesIndex.title}>Remove Liquidity</h3>
    </div>
  )
}
