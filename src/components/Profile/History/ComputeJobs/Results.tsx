import {
  ComputeResultType,
  downloadFileBrowser,
  LoggerInstance,
  Provider
} from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import { ListItem } from '@shared/atoms/Lists'
import Button from '@shared/atoms/Button'
import styles from './Results.module.css'
import FormHelp from '@shared/FormInput/Help'
import content from '../../../../../content/pages/history.json'
import { useWeb3 } from '@context/Web3'
import { useCancelToken } from '@hooks/useCancelToken'
import { getAsset } from '@utils/aquarius'

export default function Results({
  job
}: {
  job: ComputeJobMetaData
}): ReactElement {
  const providerInstance = new Provider()
  const { accountId, web3 } = useWeb3()
  const isFinished = job.dateFinished !== null

  const [datasetProvider, setDatasetProvider] = useState<string>()
  const newCancelToken = useCancelToken()

  useEffect(() => {
    async function getAssetMetadata() {
      const ddo = await getAsset(job.inputDID[0], newCancelToken())
      setDatasetProvider(ddo.services[0].serviceEndpoint)
    }
    getAssetMetadata()
  }, [job.inputDID, newCancelToken])

  function getDownloadButtonValue(type: ComputeResultType): string {
    let buttonName
    switch (type) {
      case 'output':
        buttonName = 'results'
        break
      case 'algorithmLog':
        buttonName = 'algorithm logs'
        break
      case 'configrationLog':
        buttonName = 'configuration logs'
        break
      case 'publishLog':
        buttonName = 'publish logs'
        break
      default:
        buttonName = 'results'
        break
    }
    return buttonName
  }

  async function downloadResults(resultIndex: number) {
    if (!accountId || !job) return

    try {
      const jobResult = await providerInstance.getComputeResultUrl(
        datasetProvider,
        web3,
        accountId,
        job.jobId,
        resultIndex
      )
      await downloadFileBrowser(jobResult)
    } catch (error) {
      LoggerInstance.error(error.message)
    }
  }

  return (
    <div className={styles.results}>
      <h4 className={styles.title}>Results</h4>
      {isFinished ? (
        <ul>
          {job.results &&
            Array.isArray(job.results) &&
            job.results.map((jobResult, i) =>
              jobResult.filename ? (
                <ListItem key={i}>
                  <Button
                    style="text"
                    size="small"
                    onClick={() => downloadResults(i)}
                    download
                  >
                    {getDownloadButtonValue(jobResult.type)}
                  </Button>
                </ListItem>
              ) : (
                <ListItem key={i}>No results found.</ListItem>
              )
            )}
        </ul>
      ) : (
        <p> Waiting for results...</p>
      )}
      <FormHelp className={styles.help}>{content.compute.storage}</FormHelp>
    </div>
  )
}
