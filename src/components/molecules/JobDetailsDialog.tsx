import React from 'react'
import { ComputeItem } from '@oceanprotocol/react'
import BaseDialog from '../atoms/BaseDialog'
import { findServiceByType } from '../../utils'
import styles from './JobDetailsDialog.module.css'
import MetaItem from '../templates/AssetDetails/MetaItem'
import Time from '../atoms/Time'
import shortid from 'shortid'
import Link from 'next/link'

export default function JobDetailsDialog({
  computeItem,
  isOpen,
  onClose
}: {
  computeItem: ComputeItem | undefined
  isOpen: boolean
  onClose: () => void
}) {
  if (!computeItem) return null

  const { attributes } = findServiceByType(computeItem.ddo, 'metadata')
  const { name } = attributes.main
  const {
    dateCreated,
    dateFinished,
    statusText,
    jobId,
    resultsUrls,
    algorithmLogUrl
  } = computeItem.job

  return (
    <BaseDialog title={name} open={isOpen} onClose={onClose}>
      <div className={styles.metaGrid}>
        <MetaItem title="Date Created" content={<Time date={dateCreated} />} />
        <MetaItem title="Status" content={statusText} />
        <MetaItem
          title="Date Finished"
          content={<Time date={dateFinished} />}
        />
        <MetaItem title="Job Id" content={jobId} />
      </div>
      <div className={styles.metaRow}>
        {resultsUrls && (
          <MetaItem
            title="Results"
            content={resultsUrls.map((url: string) => (
              <Link href={url} key={shortid.generate()} passHref>
                <a>{url}</a>
              </Link>
            ))}
          />
        )}
        {algorithmLogUrl && (
          <MetaItem
            title="Algorithm Log"
            content={
              <Link href={algorithmLogUrl} key={shortid.generate()} passHref>
                <a>{algorithmLogUrl}</a>
              </Link>
            }
          />
        )}
        <MetaItem
          title="Data Set"
          content={
            <Link
              href="/asset/[did]"
              as={`/asset/${computeItem.ddo.id}`}
              passHref
            >
              <a>{name}</a>
            </Link>
          }
        />
      </div>
    </BaseDialog>
  )
}
