import React, { ReactElement } from 'react'
import Cog from '@images/signalPreferences.svg'
import preferenceStyles from '../UserPreferences/index.module.css'
import Caret from '@images/caret.svg'
import Link from 'next/link'

export default function SignalPreferences(): ReactElement {
  return (
    <Link href={`/settings`}>
      <div className={preferenceStyles.preferences}>
        <Cog aria-label="Signal Settings" className={preferenceStyles.icon} />
        <Caret aria-hidden="true" className={preferenceStyles.caret} />
      </div>
    </Link>
  )
}
