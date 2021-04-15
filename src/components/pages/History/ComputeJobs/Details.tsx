import React, { ReactElement, useState } from 'react'
import { ComputeJobMetaData } from '../../../../@types/ComputeJobMetaData'
import Time from '../../../atoms/Time'
import Button from '../../../atoms/Button'
import Modal from '../../../atoms/Modal'
import MetaItem from '../../../organisms/AssetContent/MetaItem'
import { ReactComponent as External } from '../../../../images/external.svg'
import Results from './Results'
import { Status } from '.'
import styles from './Details.module.css'

export default function Details({
  job
}: {
  job: ComputeJobMetaData
}): ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isFinished = job.dateFinished !== null

  return (
    <>
      <Button style="text" size="small" onClick={() => setIsDialogOpen(true)}>
        Show Details
      </Button>
      <Modal
        title="Job Details"
        isOpen={isDialogOpen}
        onToggleModal={() => setIsDialogOpen(false)}
      >
        <div className={styles.main}>
          <Status>{job.statusText}</Status>
          {isFinished && <Results job={job} />}
        </div>

        <div className={styles.asset}>
          <h3 className={styles.title}>
            {job.assetName}{' '}
            <a
              className={styles.link}
              href={`/asset/${job.did}`}
              target="_blank"
              rel="noreferrer"
            >
              <External />
            </a>
          </h3>
          <p>
            <code>{job.did}</code>
          </p>
        </div>

        <div className={styles.asset}>
          <h3 className={styles.title}>
            {job.algoName}{' '}
            <a
              className={styles.link}
              href={`/asset/${job.algoDID}`}
              target="_blank"
              rel="noreferrer"
            >
              <External />
            </a>
          </h3>
          <p>
            <code>{job.algoDID}</code>
          </p>
        </div>

        <div className={styles.meta}>
          <MetaItem
            title="Created"
            content={<Time date={job.dateCreated} isUnix relative />}
          />
          {job.dateFinished && (
            <MetaItem
              title="Finished"
              content={<Time date={job.dateFinished} isUnix relative />}
            />
          )}
        </div>
      </Modal>
    </>
  )
}
