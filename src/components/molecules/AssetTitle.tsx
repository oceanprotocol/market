import { useMetadata } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement } from 'react'
import styles from './AssetTitle.module.css'

export default function AssetTitle({ did }: { did: string }): ReactElement {
  const { title } = useMetadata(did)
  return (
    <h3 className={styles.title}>
      <Link to={`/asset/${did}`}>{title || did}</Link>
    </h3>
  )
}
