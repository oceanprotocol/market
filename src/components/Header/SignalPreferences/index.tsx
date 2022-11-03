import React, { ReactElement } from 'react'
import Cog from '@images/signalPreferences.svg'
import preferenceStyles from '../UserPreferences/index.module.css'
import Caret from '@images/caret.svg'
import { useMarketMetadata } from '@context/MarketMetadata'
import Link from 'next/link'
import useDarkMode from '@oceanprotocol/use-dark-mode'

export default function SignalPreferences(): ReactElement {
  const { appConfig } = useMarketMetadata()
  // Calling this here because <Style /> is not mounted on first load
  const darkMode = useDarkMode(false, appConfig?.darkModeConfig)

  return (
    <Link href={`/settings`}>
      <div className={preferenceStyles.preferences}>
        <Cog aria-label="Signal Settings" className={preferenceStyles.icon} />
        <Caret aria-hidden="true" className={preferenceStyles.caret} />
      </div>
    </Link>
  )
}
