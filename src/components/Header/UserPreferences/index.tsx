import React, { ReactElement } from 'react'
import Tooltip from '@shared/atoms/Tooltip'
import Cog from '@images/cog.svg'
import styles from './index.module.css'
import Currency from './Currency'
import Debug from './Debug'
import Caret from '@images/caret.svg'
import useDarkMode from 'use-dark-mode'
import Appearance from './Appearance'
import TokenApproval from './TokenApproval'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function UserPreferences(): ReactElement {
  const { appConfig } = useMarketMetadata()
  // Calling this here because <Style /> is not mounted on first load
  const darkMode = useDarkMode(false, appConfig?.darkModeConfig)

  return (
    <Tooltip
      content={
        <ul className={styles.preferencesDetails}>
          <Currency />
          <TokenApproval />
          <Appearance darkMode={darkMode} />
          <Debug />
        </ul>
      }
      trigger="click focus"
      className={styles.preferences}
    >
      <>
        <Cog aria-label="Preferences" className={styles.icon} />
        <Caret aria-hidden="true" className={styles.caret} />
      </>
    </Tooltip>
  )
}
