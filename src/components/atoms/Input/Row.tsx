import React, { ReactElement, ReactNode } from 'react'
import { row } from './Row.module.css'

const Row = ({ children }: { children: ReactNode }): ReactElement => (
  <div className={row}>{children}</div>
)

export default Row
