import { LoggerInstance } from '@oceanprotocol/lib'
import React, { ReactElement, useState } from 'react'
import Loader from '@shared/atoms/Loader'
import { ListItem } from '@shared/atoms/Lists'
import Button from '@shared/atoms/Button'
import { useOcean } from '@context/Ocean'
import styles from './Results.module.css'
import FormHelp from '@shared/FormInput/Help'
import content from '../../../../../content/pages/history.json'

export default function Results({
  job
}: {
  job: ComputeJobMetaData
}): ReactElement {
  const { ocean, account } = useOcean()
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const isFinished = job.dateFinished !== null

  async function getResults() {
    if (!account || !ocean || !job) return

    try {
      setIsLoading(true)
      const jobStatus = await ocean.compute.status(
        account,
        job.did,
        undefined,
        undefined,
        job.jobId
      )
      if (jobStatus?.length > 0) {
        job.algorithmLogUrl = jobStatus[0].algorithmLogUrl
        job.resultsUrl = jobStatus[0].resultsUrl
      }
    } catch (error) {
      LoggerInstance.error(error.message)
    } finally {
      setIsLoading(false)
      setHasFetched(true)
    }
  }

  return (
    <div className={styles.results}>
      {hasFetched ? (
        <ul>
          <ListItem>
            {job.algorithmLogUrl ? (
              <a href={job.algorithmLogUrl} target="_blank" rel="noreferrer">
                View Log
              </a>
            ) : (
              'No logs found.'
            )}
          </ListItem>

          {job.resultsUrl &&
            Array.isArray(job.resultsUrl) &&
            job.resultsUrl.map((url, i) =>
              url ? (
                <ListItem key={job.jobId}>
                  <a href={url} target="_blank" rel="noreferrer">
                    View Result {i + 1}
                  </a>
                </ListItem>
              ) : (
                <ListItem>No results found.</ListItem>
              )
            )}
        </ul>
      ) : (
        <Button
          style="primary"
          size="small"
          onClick={() => getResults()}
          disabled={isLoading || !isFinished}
        >
          {isLoading ? (
            <Loader />
          ) : !isFinished ? (
            'Waiting for results...'
          ) : (
            'Get Results'
          )}
        </Button>
      )}
      <FormHelp className={styles.help}>{content.compute.storage}</FormHelp>
    </div>
  )
}
