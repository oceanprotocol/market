import React from 'react'
import shortid from 'shortid'
import { MetaDataDexFreight } from '../../../@types/MetaData'
import { ListItem } from '../../atoms/Lists'
import { refundPolicy, assetTerms } from '../../../../site.config'
import MetaItem from './MetaItem'
import styles from './MetaSecondary.module.css'

export default function MetaSecondary({
  attributes
}: {
  attributes: MetaDataDexFreight
}) {
  const { price } = attributes.main
  let links, supportName, supportEmail
  if (attributes && attributes.additionalInformation) {
    ;({ links, supportName, supportEmail } = attributes.additionalInformation)
  }

  return (
    <aside className={styles.metaSecondary}>
      {links && (
        <div className={styles.samples}>
          <MetaItem
            title="Sample Data"
            content={
              <ul>
                {links?.map(link => (
                  <ListItem key={shortid.generate()}>
                    <a href={link.url}>{link.name}</a>
                  </ListItem>
                ))}
              </ul>
            }
          />
        </div>
      )}
      {(supportName || supportEmail) && (
        <MetaItem
          title="Support Contact"
          content={
            <>
              {supportName && <p>{supportName}</p>}
              {supportEmail && <p>{supportEmail}</p>}
            </>
          }
        />
      )}
      {price !== '0' && (
        <MetaItem
          title="Refund Policy"
          content={
            <ul>
              {refundPolicy.map(item => (
                <ListItem key={shortid.generate()}>{item}</ListItem>
              ))}
            </ul>
          }
        />
      )}

      {assetTerms.map(item => (
        <MetaItem
          key={shortid.generate()}
          title={item.name}
          content={item.value}
        />
      ))}
    </aside>
  )
}
