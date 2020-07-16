import React, { ReactElement } from 'react'
import shortid from 'shortid'
import { ListItem } from '../../atoms/Lists'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import { MetadataMarket } from '../../../@types/Metadata'
import Tags from '../../atoms/Tags'

export default function MetaSecondary({
  metadata
}: {
  metadata: MetadataMarket
}): ReactElement {
  const { links, tags } = metadata.additionalInformation

  return (
    <aside className={styles.metaSecondary}>
      {links && (
        <div className={styles.samples}>
          <MetaItem
            title="Sample Data"
            content={
              <ul>
                {links?.map((link) => (
                  <ListItem key={shortid.generate()}>
                    <a href={link.url}>{link.name}</a>
                  </ListItem>
                ))}
              </ul>
            }
          />
        </div>
      )}

      {tags && tags.length > 0 && <Tags items={tags} />}
    </aside>
  )
}
