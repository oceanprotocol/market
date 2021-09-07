import React, { ReactElement } from 'react'
import styles from './NumberUnit.module.css'

interface NumberInnerProps {
  label: string
  value: number | string | Element | ReactElement
  small?: boolean
  icon?: Element | ReactElement
}

interface NumberUnitProps extends NumberInnerProps {
  link?: string
  linkTooltip?: string
}

const NumberInner = ({ small, label, value, icon }: NumberInnerProps) => (
  <>
    <div className={`${styles.number} ${small && styles.small}`}>
      {icon && icon}
      {value}
    </div>
    <span className={styles.label}>{label}</span>
  </>
)

export default function NumberUnit({
  link,
  linkTooltip,
  small,
  label,
  value,
  icon
}: NumberUnitProps): ReactElement {
  return (
    <div className={styles.unit}>
      {link ? (
        <a href={link} title={linkTooltip}>
          <NumberInner small={small} label={label} value={value} icon={icon} />
        </a>
      ) : (
        <NumberInner small={small} label={label} value={value} icon={icon} />
      )}
    </div>
  )
}
