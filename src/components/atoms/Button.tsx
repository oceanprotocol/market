import React, { ReactNode, FormEvent, ReactElement } from 'react'
import { Link } from 'gatsby'
import { button, primary, ghost, text, small } from './Button.module.css'

interface ButtonProps {
  children: ReactNode
  className?: string
  href?: string
  onClick?: (e: FormEvent) => void
  disabled?: boolean
  to?: string
  name?: string
  size?: 'small'
  style?: 'primary' | 'ghost' | 'text'
  type?: 'submit'
  download?: boolean
  target?: string
  rel?: string
  title?: string
}

export default function Button({
  href,
  children,
  className,
  to,
  size,
  style,
  ...props
}: ButtonProps): ReactElement {
  const variants =
    style === 'primary'
      ? primary
      : style === 'ghost'
      ? ghost
      : style === 'text'
      ? text
      : null
  const sizes = size === 'small' ? small : null
  const styleClasses = `${button} ${variants} ${sizes} ${className}`

  return to ? (
    <Link to={to} className={styleClasses} {...props}>
      {children}
    </Link>
  ) : href ? (
    <a href={href} className={styleClasses} {...props}>
      {children}
    </a>
  ) : (
    <button className={styleClasses} {...props}>
      {children}
    </button>
  )
}
