import React, { ReactElement, ReactNode } from 'react'
import styles from './InputGroup.module.css'

const InputGroup = ({
  children,
  customClass
}: {
  children: ReactNode
  customClass?: string
}): ReactElement => (
  <div className={`${styles.inputGroup} ${customClass}`}>{children}</div>
)

export default InputGroup
