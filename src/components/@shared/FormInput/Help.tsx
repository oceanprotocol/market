import React, { ReactElement } from 'react'
import styles from './Help.module.css'
import Markdown from '@shared/Markdown'

const FormHelp = ({
  children,
  className
}: {
  children: string
  className?: string
}): ReactElement => {
  return (
    <Markdown className={`${styles.help} ${className || ''}`} text={children} />
  )
}

export default FormHelp
