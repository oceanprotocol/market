import React, { ReactElement, useState } from 'react'
import Button from '../../../atoms/Button'
import PoolTransactions from '../../../molecules/PoolTransactions'
import styles from './Transactions.module.css'
import { ReactComponent as Caret } from '../../../../images/caret.svg'
import { useAsset } from '../../../../providers/Asset'

export default function Transactions(): ReactElement {
  const [open, setOpen] = useState(false)
  const { price } = useAsset()
  function handleClick() {
    setOpen(!open)
  }

  return (
    <div
      className={`${styles.transactions} ${open === true ? styles.open : ''}`}
    >
      {/* TODO: onClick on h3 is nasty but we're in a hurry */}
      <h3 className={styles.title} onClick={handleClick}>
        Your Pool Transactions{' '}
        <Button
          style="text"
          size="small"
          onClick={handleClick}
          className={styles.toggle}
        >
          {open ? 'Hide' : 'Show'} <Caret />
        </Button>
      </h3>
      {open === true && (
        <PoolTransactions poolAddress={price?.address} minimal />
      )}
    </div>
  )
}
