import classNames from 'classnames/bind'
import React, { ReactElement, useState } from 'react'

import ReactMarkdown from 'react-markdown'
import styles from './Progressbar.module.css'

const cx = classNames.bind(styles)

const Progressbar = ({
  progress,
  color,
  className,
  id
}: {
  progress: number
  color?: string
  className?: string
  id?: string
}): ReactElement => {
  const styleClasses = cx({
    progressbar_bg: true,
    [className]: className
  })

  return (
    <div className={styleClasses} id={id}>
      <div
        className={styles.progressbar_progress}
        style={{ width: `${progress}%`, backgroundColor: color }}
      />
    </div>
  )
}

export default Progressbar
