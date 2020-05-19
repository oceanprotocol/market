import React from 'react'
import styles from './InputGroup.module.css'

const InputGroup = ({ children }: { children: any }) => (
  <div className={styles.inputGroup}>{children}</div>
)

export default InputGroup
