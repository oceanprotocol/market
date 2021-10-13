import React, { ReactElement } from 'react'
<<<<<<< HEAD:src/components/Profile/Header/NumberUnit.tsx
import Markdown from '@shared/Markdown'
=======
import Markdown from '@shared/atoms/Markdown'
>>>>>>> 14d71ad2 (reorganize all the things):src/components/@shared/NumberUnit.tsx
import Tooltip from '@shared/atoms/Tooltip'
import styles from './NumberUnit.module.css'

interface NumberUnitProps {
  label: string
  value: number | string | Element | ReactElement
  small?: boolean
  icon?: Element | ReactElement
  tooltip?: string
}

export default function NumberUnit({
  small,
  label,
  value,
  icon,
  tooltip
}: NumberUnitProps): ReactElement {
  return (
    <div className={styles.unit}>
      <div className={`${styles.number} ${small && styles.small}`}>
        {icon && icon}
        {value}
      </div>
      <span className={styles.label}>
        {label}{' '}
        {tooltip && (
          <Tooltip
            content={<Markdown text={tooltip} />}
            className={styles.tooltip}
          />
        )}
      </span>
    </div>
  )
}
