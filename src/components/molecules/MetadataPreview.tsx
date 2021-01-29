import React, { FormEvent, ReactElement, useState } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import Markdown from '../atoms/Markdown'
import Tags from '../atoms/Tags'
import MetaItem from '../organisms/AssetContent/MetaItem'
import styles from './MetadataPreview.module.css'
import File from '../atoms/File'
import { MetadataPublishForm } from '../../@types/MetaData'
import Button from '../atoms/Button'
import { transformTags } from '../../utils/metadata'

function Description({ description }: { description: string }) {
  const [fullDescription, setFullDescription] = useState<boolean>(false)

  const textLimit = 500 // string.length
  const descriptionDisplay =
    fullDescription === true
      ? description
      : `${description.substring(0, textLimit)}${
          description.length > textLimit ? '...' : ''
        }`

  function handleDescriptionToggle(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    setFullDescription(!fullDescription)
  }

  return (
    <div className={styles.description}>
      <Markdown text={descriptionDisplay} />
      {description.length > textLimit && (
        <Button
          style="text"
          size="small"
          onClick={handleDescriptionToggle}
          className={styles.toggle}
        >
          {fullDescription === true ? 'Close' : 'Expand'}
        </Button>
      )}
    </div>
  )
}

function MetaFull({ values }: { values: Partial<MetadataPublishForm> }) {
  return (
    <div className={styles.metaFull}>
      {Object.entries(values)
        .filter(
          ([key, value]) =>
            !(
              key.includes('name') ||
              key.includes('description') ||
              key.includes('tags') ||
              key.includes('files') ||
              key.includes('links') ||
              key.includes('termsAndConditions') ||
              key.includes('dataTokenOptions') ||
              value === undefined ||
              value === ''
            )
        )
        .map(([key, value]) => (
          <MetaItem key={key} title={key} content={value} />
        ))}
    </div>
  )
}

function Sample({ url }: { url: string }) {
  return (
    <Button
      href={url}
      target="_blank"
      rel="noreferrer"
      download
      style="text"
      size="small"
    >
      Download Sample
    </Button>
  )
}

export default function MetadataPreview({
  values
}: {
  values: Partial<MetadataPublishForm>
}): ReactElement {
  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>
      <header>
        {values.name && <h3 className={styles.title}>{values.name}</h3>}
        {values.dataTokenOptions?.name && (
          <p
            className={styles.datatoken}
          >{`${values.dataTokenOptions.name} — ${values.dataTokenOptions.symbol}`}</p>
        )}
        {values.description && <Description description={values.description} />}

        <div className={styles.asset}>
          {values.files?.length > 0 && typeof values.files !== 'string' && (
            <File
              file={values.files[0] as FileMetadata}
              className={styles.file}
              small
            />
          )}
        </div>

        {typeof values.links !== 'string' && values.links?.length && (
          <Sample url={(values.links[0] as FileMetadata).url} />
        )}
        {values.tags && <Tags items={transformTags(values.tags)} />}
      </header>

      <MetaFull values={values} />
    </div>
  )
}
