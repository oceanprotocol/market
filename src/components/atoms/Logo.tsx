import React, { ReactElement } from 'react'
//import { ReactComponent as LogoAssetFull } from '@oceanprotocol/art/logo/logo.svg'
//import { ReactComponent as LogoAsset } from '../../images/logo.svg'
import logo from '../../ewai/images/ew-logo.png'
import logofull from '../../ewai/images/ew-logofull2.png'
import styles from './Logo.module.css'

export default function Logo({
  noWordmark
}: {
  noWordmark?: boolean
}): ReactElement {
  return noWordmark ? (
    <img src={logo} className={styles.logo} alt="Logo" />
  ) : (
    <img src={logofull} className={styles.logo} alt="Logo" />
  )
}
