import React, { ReactElement } from 'react'
import { ComputeItem } from '@oceanprotocol/react'
import BaseDialog from '../../atoms/BaseDialog'
import styles from './JobDetailsDialog.module.css'
import MetaItem from '../../organisms/AssetContent/MetaItem'
import Time from '../../atoms/Time'
import shortid from 'shortid'
import { Link } from 'gatsby'

export default function JobDetailsDialog({
  computeItem,
  isOpen,
  onClose
}: {
  computeItem: ComputeItem | undefined
  isOpen: boolean
  onClose: () => void
}): ReactElement {
  if (!computeItem) return null

  const { attributes } = computeItem.ddo.findServiceByType('metadata')
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
              <Link to={url} key={shortid.generate()}>
                {url}
              </Link>
            ))}
          />
        )}
        {algorithmLogUrl && (
          <MetaItem
            title="Algorithm Log"
            content={<Link to={algorithmLogUrl}>{algorithmLogUrl}</Link>}
          />
        )}
        <MetaItem
          title="Data Set"
          content={<Link to={`/asset/${computeItem.ddo.id}`}>{name}</Link>}
        />
      </div>
    </BaseDialog>
  )
}
