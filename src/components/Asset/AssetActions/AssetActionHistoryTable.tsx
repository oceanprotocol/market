import React, { ReactElement, ReactNode, useState } from 'react'
import Button from '@shared/atoms/Button'
import styles from './AssetActionHistoryTable.module.css'
import Caret from '@images/caret.svg'

export default function AssetActionHistoryTable({
  title,
  children
}: {
  title: string
  children: ReactNode
}): ReactElement {
  const [open, setOpen] = useState(false)

  function handleClick() {
    setOpen(!open)
  }

  return (
    <div className={`${styles.actions} ${open === true ? styles.open : ''}`}>
      {/* TODO: onClick on h3 is nasty but we're in a hurry */}
      <h3 className={styles.title} onClick={handleClick}>
        {`${title} `}
        <Button
          style="text"
          size="small"
          onClick={handleClick}
          className={styles.toggle}
        >
          {open ? 'Hide' : 'Show'} <Caret />
        </Button>
      </h3>
      {open === true && children}
    </div>
  )
}
