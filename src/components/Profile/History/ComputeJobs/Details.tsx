import React, { ReactElement, useEffect, useState } from 'react'
import Time from '@shared/atoms/Time'
import Button from '@shared/atoms/Button'
import Modal from '@shared/atoms/Modal'
import External from '@images/external.svg'
import { retrieveAsset } from '@utils/aquarius'
import Results from './Results'
import styles from './Details.module.css'
import { useCancelToken } from '@hooks/useCancelToken'
import MetaItem from '../../../Asset/AssetContent/MetaItem'
import { useMarketMetadata } from '@context/MarketMetadata'

function Asset({
  title,
  symbol,
  did
}: {
  title: string
  symbol: string
  did: string
}) {
  return (
    <div className={styles.asset}>
      <h3 className={styles.assetTitle}>
        {title}{' '}
        <a
          className={styles.assetLink}
          href={`/asset/${did}`}
          target="_blank"
          rel="noreferrer"
        >
          <External />
        </a>
      </h3>
      <p className={styles.assetMeta}>
        <span className={styles.assetMeta}> {`${symbol} | `}</span>
        <code className={styles.assetMeta}>{did}</code>
      </p>
    </div>
  )
}

function DetailsAssets({ job }: { job: ComputeJobMetaData }) {
  const { appConfig } = useMarketMetadata()
  const newCancelToken = useCancelToken()

  const [algoName, setAlgoName] = useState<string>()
  const [algoDtSymbol, setAlgoDtSymbol] = useState<string>()

  useEffect(() => {
    async function getAlgoMetadata() {
      const ddo = await retrieveAsset(job.algoDID, newCancelToken())
      setAlgoDtSymbol(ddo.datatokens[0].symbol)
      setAlgoName(ddo?.metadata.name)
    }
    getAlgoMetadata()
  }, [appConfig.metadataCacheUri, job.algoDID, newCancelToken])

  return (
    <>
      <Asset
        title={job.assetName}
        symbol={job.assetDtSymbol}
        did={job.inputDID[0]}
      />
      <Asset title={algoName} symbol={algoDtSymbol} did={job.algoDID} />
    </>
  )
}

export default function Details({
  job
}: {
  job: ComputeJobMetaData
}): ReactElement {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Button style="text" size="small" onClick={() => setIsDialogOpen(true)}>
        Show Details
      </Button>
      <Modal
        title={job.statusText}
        isOpen={isDialogOpen}
        onToggleModal={() => setIsDialogOpen(false)}
      >
        <DetailsAssets job={job} />
        <Results job={job} />

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
          <MetaItem title="Job ID" content={<code>{job.jobId}</code>} />
        </div>
      </Modal>
    </>
  )
}
