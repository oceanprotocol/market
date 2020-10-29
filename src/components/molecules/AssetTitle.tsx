import { useMetadata } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement } from 'react'
import styles from './AssetTitle.module.css'

export default function AssetTitle({
  did,
  title
}: {
  did?: string
  title?: string
}): ReactElement {
  const metadata = useMetadata(did)

  return (
    <h3 className={styles.title}>
      <Link to={`/asset/${did}`}>{title || metadata.title || did}</Link>
    </h3>
  )
}
