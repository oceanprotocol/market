import React, { ReactElement } from 'react'
import styles from './Disclaimer.module.css'
import Markdown from '../Markdown'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

const FormDisclaimer = ({
  children,
  className,
  visible
}: {
  children: string
  className?: string
  visible?: boolean
}): ReactElement => {
  const styleClasses = cx({
    disclaimer: true,
    hidden: !visible,
    [className]: className
  })

  return <Markdown className={styleClasses} text={children} />
}

export default FormDisclaimer
