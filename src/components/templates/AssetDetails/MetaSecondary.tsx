import React, { ReactElement } from 'react'
import shortid from 'shortid'
import { ListItem } from '../../atoms/Lists'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'
import { MetaDataMarket } from '../../../@types/MetaData'

export default function MetaSecondary({
  metadata
}: {
  metadata: MetaDataMarket
}): ReactElement {
  let links
  if (metadata && metadata.additionalInformation) {
    ;({ links } = metadata.additionalInformation)
  }

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
    </aside>
  )
}
