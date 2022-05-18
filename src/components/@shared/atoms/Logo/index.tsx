import React, { ReactElement } from 'react'
import LogoAssetFull from '@oceanprotocol/art/logo/logo.svg'
import LogoAsset from '@images/logo.svg'
import styles from './index.module.css'

export interface LogoProps {
  noWordmark?: boolean
}

export default function Logo({ noWordmark }: LogoProps): ReactElement {
  return noWordmark ? (
    <LogoAsset className={styles.logo} />
  ) : (
    <LogoAssetFull className={styles.logo} />
  )
}
