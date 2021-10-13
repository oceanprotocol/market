import React, { ReactElement } from 'react'
import styles from './Disclaimer.module.css'
import classNames from 'classnames/bind'
import Alert from '@shared/atoms/Alert'

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

  return (
    <div className={styleClasses}>
      <Alert text={children} state="info" />
    </div>
  )
}

export default FormDisclaimer
