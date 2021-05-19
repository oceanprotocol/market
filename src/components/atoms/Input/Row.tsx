import React, { ReactElement, ReactNode } from 'react'
import * as styles from './Row.module.css'

const Row = ({ children }: { children: ReactNode }): ReactElement => (
  <div className={styles.row}>{children}</div>
)

export default Row
