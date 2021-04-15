import React, { ReactElement, useEffect, useState } from 'react'
import { ComputeJobMetaData } from '../../../../@types/ComputeJobMetaData'
import Time from '../../../atoms/Time'
import Button from '../../../atoms/Button'
import Modal from '../../../atoms/Modal'
import MetaItem from '../../../organisms/AssetContent/MetaItem'
import { ReactComponent as External } from '../../../../images/external.svg'
import Results from './Results'
import { Status } from '.'
import styles from './Details.module.css'
import { getAssetsNames } from '../../../../utils/aquarius'
import { useOcean } from '../../../../providers/Ocean'
import axios from 'axios'

function Asset({ title, did }: { title: string; did: string }) {
  return (
    <div className={styles.asset}>
      <h3 className={styles.title}>
        {title}{' '}
        <a
          className={styles.link}
          href={`/asset/${did}`}
          target="_blank"
          rel="noreferrer"
        >
          <External />
        </a>
      </h3>
      <p>
        <code>{did}</code>
      </p>
    </div>
  )
}

function DetailsAssets({ job }: { job: ComputeJobMetaData }) {
  const { config } = useOcean()
  const [algoName, setAlgoName] = useState<string>()

  useEffect(() => {
    async function getAlgoTitle() {
      const source = axios.CancelToken.source()

      const name = await getAssetsNames(
        [job.algoDID],
        config.metadataCacheUri,
        source.token
      )
      setAlgoName(name[job.algoDID])
    }
    getAlgoTitle()
  }, [config?.metadataCacheUri, job.algoDID])

  return (
    <>
      <Asset title={job.assetName} did={job.inputDID[0]} />
      <Asset title={algoName} did={job.algoDID} />
    </>
  )
}

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

        <DetailsAssets job={job} />
      </Modal>
    </>
  )
}
