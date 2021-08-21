import React, { ReactElement } from 'react'
import { ReactComponent as LogoAssetFull } from '@oceanprotocol/art/logo/logo.svg'
import { ReactComponent as LogoAssetBranding } from '../../images/logo.svg'
import { ReactComponent as LogoAsset } from '../../images/ocean-logo.svg'

import styles from './Logo.module.css'

export default function Logo({
  noWordmark,
  branding
}: {
  noWordmark?: boolean
  branding?: boolean
}): ReactElement {
  return branding ? (
    <LogoAssetBranding className={styles.logo} />
  ) : noWordmark ? (
    <LogoAsset className={styles.logo} />
  ) : (
    <LogoAssetFull className={styles.logo} />
  )
}
