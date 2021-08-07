import classNames from 'classnames/bind'
import React, { ReactElement, useState, useEffect } from 'react'

import slugify from 'slugify'
import styles from './Switch.module.css'

const cx = classNames.bind(styles)

export default function Switch({
  name,
  isChecked,
  onChange,
  size
}: {
  name: string
  isChecked?: boolean
  onChange?: (checked: boolean) => void
  size?: 'small' | 'default'
}): ReactElement {
  const [checked, setChecked] = useState<boolean>(false)

  useEffect(() => {
    setChecked(isChecked)
  }, [isChecked])

  return (
    <div className={cx(styles.container, { [size]: size })}>
      <label className={styles.switch} htmlFor={slugify(name)}>
        <input
          type="checkbox"
          id={slugify(name)}
          onChange={() => {
            setChecked(!checked)
            onChange && onChange(!checked)
          }}
          checked={checked || false}
        />
        <div className={`${styles.slider} ${styles.round}`} />
      </label>
    </div>
  )
}
