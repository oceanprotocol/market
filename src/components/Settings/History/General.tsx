import React, { ReactElement } from 'react'
// import Preferences from '../../Header/UserPreferences/index'
import styles from './index.module.css'
import TokenApproval from '../../Header/UserPreferences/TokenApproval'
import Currency from '../../Header/UserPreferences/Currency'
import Appearance from '../../Header/UserPreferences/Appearance'
import useDarkMode from 'use-dark-mode'
import Debug from '../../Header/UserPreferences/Debug'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function GeneralTab(): ReactElement {
  const { appConfig } = useMarketMetadata()
  const darkMode = useDarkMode(false, appConfig?.darkModeConfig)

  // return <Preferences />
  return (
    <>
      <ul className={styles.generalDetails}>
        <Currency />
        <TokenApproval />
        <Appearance darkMode={darkMode} />
        <Debug />
      </ul>
    </>
  )
}
