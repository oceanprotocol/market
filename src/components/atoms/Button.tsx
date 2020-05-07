import React, { ReactElement } from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

declare type ButtonProps = {
  children: string | ReactElement
  className?: string
  primary?: boolean
  link?: boolean
  href?: string
  size?: string
  onClick?: any
  disabled?: boolean
}

const Button = ({
  primary,
  link,
  href,
  size,
  children,
  className,
  ...props
}: ButtonProps) => {
  const classes = primary
    ? `${styles.button} ${styles.primary}`
    : link
    ? `${styles.button} ${styles.link}`
    : styles.button

  return href ? (
    <Link href={href}>
      <a className={`${classes} ${className}`} {...props}>
        {children}
      </a>
    </Link>
  ) : (
    <button className={`${classes} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
