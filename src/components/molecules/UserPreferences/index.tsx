import React, { ReactElement } from 'react'
import Tooltip from '../../atoms/Tooltip'
import Preferences from './Preferences'
import { ReactComponent as Cog } from '../../../images/cog.svg'
import styles from './index.module.css'

export default function UserPreferences(): ReactElement {
  return (
    <Tooltip
      content={<Preferences />}
      trigger="click focus"
      className={styles.preferences}
    >
      <Cog aria-label="Preferences" className={styles.icon} />
    </Tooltip>
  )
}
