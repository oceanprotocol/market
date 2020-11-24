import React, { FormEvent, ReactElement, useState } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import Markdown from '../../atoms/Markdown'
import Tags from '../../atoms/Tags'
import MetaItem from '../../organisms/AssetContent/MetaItem'
import styles from './Preview.module.css'
import File from '../../atoms/File'
import { MetadataPublishForm } from '../../../@types/MetaData'
import Button from '../../atoms/Button'
import { transformTags } from './utils'
import { FormFieldProps } from '../../../@types/Form'
import { mustBeHidden } from '../../atoms/Input'

export default function Preview({
  values,
  data
}: {
  values: Partial<MetadataPublishForm>
  data?: FormFieldProps[]
}): ReactElement {
  const [fullDescription, setFullDescription] = useState<boolean>(false)

  const textLimit = 500 // string.length
  const description =
    fullDescription === true
      ? values.description
      : `${values.description.substring(0, textLimit)}${
          values.description.length > textLimit ? `...` : ''
        }`

  function handleDescriptionToggle(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    setFullDescription(!fullDescription)
  }

  return (
    <div className={styles.preview}>
      <h2 className={styles.previewTitle}>Preview</h2>
      <header>
        {values.name && <h3 className={styles.title}>{values.name}</h3>}
        {values.author && <p className={styles.author}>{values.author}</p>}

        {values.description && (
          <div className={styles.description}>
            <Markdown text={description} />
            {values.description.length > textLimit && (
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
        )}

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
          <Button
            href={(values.links[0] as FileMetadata).url}
            target="_blank"
            rel="noreferrer"
            download
            style="text"
            size="small"
          >
            Download Sample
          </Button>
        )}
        {values.tags && <Tags items={transformTags(values.tags)} />}
      </header>

      <div className={styles.metaFull}>
        {Object.entries(values)
          .filter(
            ([key, value]) =>
              !(
                key.includes('author') ||
                key.includes('name') ||
                key.includes('description') ||
                key.includes('tags') ||
                key.includes('files') ||
                key.includes('links') ||
                key.includes('termsAndConditions') ||
                key.includes('dataTokenOptions') ||
                key.includes('providerUri') ||
                value === undefined ||
                value === '' ||
                (data &&
                  mustBeHidden(
                    values,
                    data.find((field) => field.name === key).options
                  ))
              )
          )
          .map(([key, value]) => (
            <MetaItem key={key} title={key} content={value} type={key} />
          ))}
      </div>
    </div>
  )
}
