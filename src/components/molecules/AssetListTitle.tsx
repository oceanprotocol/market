import { useMetadata } from '@oceanprotocol/react'
import { Link } from 'gatsby'
import React, { ReactElement } from 'react'
import { useDataPartner } from '../../hooks/useDataPartner'
import { PartnerBadge } from '../atoms/Partner'
import styles from './AssetListTitle.module.css'

export default function AssetListTitle({
  did,
  title,
  owner
}: {
  did?: string
  title?: string
  owner?: string
}): ReactElement {
  const metadata = useMetadata(did)
  const { partner } = useDataPartner(owner)

  return (
    <h3 className={styles.title}>
      <Link to={`/asset/${did}`}>
        {partner && <PartnerBadge />} {title || metadata.title || did}
      </Link>
    </h3>
  )
}
