import React, { FormEvent, ReactElement, useState } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import Markdown from '../../atoms/Markdown'
import Tags from '../../atoms/Tags'
import MetaItem from '../../organisms/AssetContent/MetaItem'
import styles from './Preview.module.css'
import File from '../../atoms/File'
import { MetadataPublishForm } from '../../../@types/MetaData'
import Button from '../../atoms/Button'
import Conversion from '../../atoms/Price/Conversion'
import PriceUnit from '../../atoms/Price/PriceUnit'

export default function Preview({
  values
}: {
  values: Partial<MetadataPublishForm>
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

          {values.price && (
            <div className={styles.price}>
              <MetaItem
                title={`Price: ${values.price.type}`}
                content={
                  <>
                    <PriceUnit
                      price="1"
                      symbol={values.price.datatoken?.symbol}
                      small
                    />{' '}
                    = <PriceUnit price={`${values.price.price}`} small />
                    <Conversion price={`${values.price.price}`} />
                  </>
                }
              />
            </div>
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
                key.includes('links') ||
                key.includes('termsAndConditions') ||
                key.includes('price') ||
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
