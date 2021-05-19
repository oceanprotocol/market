import React, { ReactElement, ReactNode } from 'react'
import { inputGroup } from './InputGroup.module.css'

const InputGroup = ({ children }: { children: ReactNode }): ReactElement => (
  <div className={inputGroup}>{children}</div>
)

export default InputGroup
