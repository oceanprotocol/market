import React, { ReactElement, ReactNode } from 'react'
import styles from './InputGroup.module.css'

const InputGroup = ({ children }: { children: ReactNode }): ReactElement => (
  <div className={styles.inputGroup}>{children}</div>
)

export default InputGroup
