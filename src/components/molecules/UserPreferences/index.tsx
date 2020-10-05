import React, { ReactElement } from 'react'
import Tooltip from '../../atoms/Tooltip'
import { ReactComponent as Cog } from '../../../images/cog.svg'
import styles from './index.module.css'
import Currency from './Currency'
import Debug from './Debug'
import { ReactComponent as Caret } from '../../../images/caret.svg'

export default function UserPreferences(): ReactElement {
  return (
    <Tooltip
      content={
        <ul className={styles.preferencesDetails}>
          <Currency />
          <Debug />
        </ul>
      }
      trigger="click focus"
      className={styles.preferences}
    >
      <Cog aria-label="Preferences" className={styles.icon} />
      <Caret aria-hidden="true" />
    </Tooltip>
  )
}
