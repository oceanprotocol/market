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
import Chain from './Chain'

export default function UserPreferences(): ReactElement {
  // Calling this here because <Theme /> is not mounted on first load
  const darkMode = useDarkMode(false, darkModeConfig)

  return (
    <Tooltip
      content={
        <ul className={styles.preferencesDetails}>
          <Currency />
          <Appearance darkMode={darkMode} />
          <Chain />
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
