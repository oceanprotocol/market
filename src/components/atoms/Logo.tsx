import React, { ReactElement } from 'react'
import { ReactComponent as LogoAssetFull } from '@oceanprotocol/art/logo/logo.svg'
import { ReactComponent as LogoAsset } from '../../images/logo.svg'
import { logo } from './Logo.module.css'

export default function Logo({
  noWordmark
}: {
  noWordmark?: boolean
}): ReactElement {
  return noWordmark ? (
    <LogoAsset className={logo} />
  ) : (
    <LogoAssetFull className={logo} />
  )
}
