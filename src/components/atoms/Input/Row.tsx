import React from 'react'
import styles from './Row.module.css'

const Row = ({ children }: { children: any }) => (
  <div className={styles.row}>{children}</div>
)

export default Row
