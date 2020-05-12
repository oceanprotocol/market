import React, { ReactElement } from 'react'
import { ReactComponent as LogoAsset } from '@oceanprotocol/art/logo/logo.svg'
import styles from './Logo.module.css'

export default function Logo(): ReactElement {
  return <LogoAsset className={styles.logo} />
}
