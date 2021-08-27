import React, { ReactElement } from 'react'
import Tooltip from '../../atoms/Tooltip'
import { ReactComponent as Cog } from '../../../images/cog.svg'
import styles from './index.module.css'
import Currency from './Currency'
import Debug from './Debug'
import { ReactComponent as Caret } from '../../../images/caret.svg'
import useDarkMode from 'use-dark-mode'
import Appearance from './Appearance'
import { darkModeConfig } from '../../../../app.config'

export default function UserPreferences(): ReactElement {
  // Calling this here because <Style /> is not mounted on first load
  const darkMode = useDarkMode(false, darkModeConfig)

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
      zIndex={11}
    >
      <Cog aria-label="Preferences" className={styles.icon} />
      <Caret aria-hidden="true" className={styles.caret} />
    </Tooltip>
  )
}
