import React, { ReactElement } from 'react'
import Markdown from '../Markdown'
import { help } from './Help.module.css'

const FormHelp = ({
  children,
  className
}: {
  children: string
  className?: string
}): ReactElement => (
  <Markdown className={`${help} ${className}`} text={children} />
)

export default FormHelp
