import React from 'react'
import cn from 'classnames'

// interface to declare all our prop types
interface Props
  extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    React.AriaAttributes {
  children: React.ReactNode
  onClick: () => void
  variant?: string // default, primary, info, success, warning, danger, dark
  size?: string // sm, md, lg
  disabled?: boolean
  icon?: any
}

// button component, consuming props
const Button: React.FC<Props> = ({
  className,
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled,
  icon,
  ...rest
}) => {
  let classes =
    'inline-flex items-center border border-gray-500 font-medium rounded focus:outline-none transition ease-in-out duration-150 px-4 py-2 rounded-md'

  switch (variant) {
    case 'primary':
      classes = cn(
        classes,
        'text-white bg-gray-600 hover:bg-gray-400 focus:border-gray-300 focus:shadow-outline-gray'
      )
      break
    case 'secondary':
      classes = cn(
        classes,
        'text-white bg-gray-600 hover:bg-gray-400 focus:border-gray-300 focus:shadow-outline-gray'
      )
      break
    case 'white':
      classes = cn(
        classes,
        'text-white bg-gray-600 hover:bg-gray-400 focus:border-gray-300 focus:shadow-outline-gray'
      )
      break
  }

  classes = cn(classes, className)

  return (
    <button
      className={`${classes} ${size} ` + (disabled ? ' disabled' : '')}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <div className="flex flex-row space-x-2.5">{children}</div>
    </button>
  )
}

export default Button
