import React, { ReactElement } from 'react'
import styles from './Help.module.css'
import Markdown from '@shared/atoms/Markdown'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const FormHelp = ({
  children,
  className
}: {
  children: string
  className?: string
}): ReactElement => {
  const styleClasses = cx({
    help: true,
    [className]: className
  })

  return <Markdown className={styleClasses} text={children} />
}

export default FormHelp
