import React, { ReactElement } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import Markdown from '../../atoms/Markdown'
import Tags from '../../atoms/Tags'
import MetaItem from '../../organisms/AssetContent/MetaItem'
import styles from './Preview.module.css'
import File from '../../atoms/File'
import { MetadataPublishForm } from '../../../@types/Metadata'

export default function Preview({
  values
}: {
  values: MetadataPublishForm
}): ReactElement {
  return (
    <div className={styles.preview}>
      <header>
        {values.name && <h2>{values.name}</h2>}
        {values.description && <Markdown text={values.description} />}
        {values.files && values.files.length && (
          <File
            file={values.files[0] as FileMetadata}
            className={styles.file}
            small
          />
        )}
        {values.tags && <Tags items={values.tags.split(',')} />}
      </header>

      <div className={styles.metaFull}>
        {Object.entries(values)
          .filter(
            ([key, value]) =>
              !(
                key.includes('name') ||
                key.includes('description') ||
                key.includes('tags') ||
                key.includes('files') ||
                key.includes('termsAndConditions') ||
                value === undefined ||
                value === ''
              )
          )
          .map(([key, value]) => (
            <MetaItem key={key} title={key} content={value} />
          ))}
      </div>
    </div>
  )
}
