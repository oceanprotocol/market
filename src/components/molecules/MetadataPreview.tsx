import React, { FormEvent, ReactElement, useState } from 'react'
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import Button from '../atoms/Button'
import Markdown from '../atoms/Markdown'
import Tags from '../atoms/Tags'
import File from '../atoms/File'
import MetaItem from '../organisms/AssetContent/MetaItem'
import {
  MetadataPublishFormDataset,
  MetadataPublishFormAlgorithm
} from '../../@types/MetaData'
import { transformTags } from '../../utils/metadata'
import {
  description as descriptionStyle,
  toggle,
  metaFull,
  preview,
  previewTitle,
  title,
  datatoken,
  asset,
  metaAlgorithm
} from './MetadataPreview.module.css'

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
    <div className={descriptionStyle}>
      <Markdown text={descriptionDisplay} />
      {description.length > textLimit && (
        <Button
          style="text"
          size="small"
          onClick={handleDescriptionToggle}
          className={toggle}
        >
          {fullDescription === true ? 'Close' : 'Expand'}
        </Button>
      )}
    </div>
  )
}

function MetaFull({ values }: { values: Partial<MetadataPublishFormDataset> }) {
  return (
    <div className={metaFull}>
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
              key.includes('dockerImage') ||
              key.includes('algorithmPrivacy') ||
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

export function MetadataPreview({
  values
}: {
  values: Partial<MetadataPublishFormDataset>
}): ReactElement {
  return (
    <div className={preview}>
      <h2 className={previewTitle}>Preview</h2>
      <header>
        {values.name && <h3 className={title}>{values.name}</h3>}
        {values.dataTokenOptions?.name && (
          <p
            className={datatoken}
          >{`${values.dataTokenOptions.name} — ${values.dataTokenOptions.symbol}`}</p>
        )}
        {values.description && <Description description={values.description} />}

        <div className={asset}>
          {values.files?.length > 0 && typeof values.files !== 'string' && (
            <File file={values.files[0] as FileMetadata} small />
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

export function MetadataAlgorithmPreview({
  values
}: {
  values: Partial<MetadataPublishFormAlgorithm>
}): ReactElement {
  return (
    <div className={preview}>
      <h2 className={previewTitle}>Preview</h2>
      <header>
        {values.name && <h3 className={title}>{values.name}</h3>}
        {values.dataTokenOptions?.name && (
          <p
            className={datatoken}
          >{`${values.dataTokenOptions.name} — ${values.dataTokenOptions.symbol}`}</p>
        )}
        {values.description && <Description description={values.description} />}

        <div className={asset}>
          {values.files?.length > 0 && typeof values.files !== 'string' && (
            <File file={values.files[0] as FileMetadata} small />
          )}
        </div>
        {values.tags && <Tags items={transformTags(values.tags)} />}
      </header>
      <div className={metaAlgorithm}>
        {values.dockerImage && (
          <MetaItem
            key="dockerImage"
            title="Docker Image"
            content={values.dockerImage}
          />
        )}
        {values.algorithmPrivacy && (
          <MetaItem
            key="privateAlgorithm"
            title="Private Algorithm"
            content="Yes"
          />
        )}
      </div>
      <MetaFull values={values} />
    </div>
  )
}
