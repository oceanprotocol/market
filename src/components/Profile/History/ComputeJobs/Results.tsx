import {
  downloadFileBrowser,
  LoggerInstance,
  Provider
} from '@oceanprotocol/lib'
import React, { ReactElement, useState } from 'react'
import { ListItem } from '@shared/atoms/Lists'
import Button from '@shared/atoms/Button'
import styles from './Results.module.css'
import FormHelp from '@shared/FormInput/Help'
import content from '../../../../../content/pages/history.json'
import { useWeb3 } from '@context/Web3'

export default function Results({
  job
}: {
  job: ComputeJobMetaData
}): ReactElement {
  const providerInstance = new Provider()
  const { accountId, web3 } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const isFinished = job.dateFinished !== null

  async function downloadResults(resultIndex: number) {
    if (!accountId || !job) return

    try {
      setIsLoading(true)
      const jobResult = await providerInstance.getComputeResultUrl(
        'https://v4.provider.rinkeby.oceanprotocol.com/',
        web3,
        accountId,
        job.jobId,
        resultIndex
      )
      await downloadFileBrowser(jobResult)
    } catch (error) {
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.results}>
      {isFinished ? (
        <ul>
          {job.results &&
            Array.isArray(job.results) &&
            job.results.map((jobResult, i) =>
              jobResult.filename ? (
                <ListItem key={i}>
                  <Button
                    style="primary"
                    size="small"
                    onClick={() => downloadResults(i)}
                    disabled={isLoading || !isFinished}
                  >
                    {`Download ${jobResult.filename}`}
                  </Button>
                </ListItem>
              ) : (
                <ListItem>No results found.</ListItem>
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
