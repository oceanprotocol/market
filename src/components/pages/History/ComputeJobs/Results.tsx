import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useState } from 'react'
import Loader from '../../../atoms/Loader'
import { ComputeJobMetaData } from '../../../../@types/ComputeJobMetaData'
import shortid from 'shortid'
import { ListItem } from '../../../atoms/Lists'
import Button from '../../../atoms/Button'
import { useOcean } from '../../../../providers/Ocean'
import styles from './Results.module.css'

export default function Results({
  job
}: {
  job: ComputeJobMetaData
}): ReactElement {
  const { ocean, account } = useOcean()
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

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
      Logger.error(error.message)
    } finally {
      setIsLoading(false)
      setHasFetched(true)
    }
  }

  return hasFetched ? (
    <ul className={styles.results}>
      <ListItem>
        {job.algorithmLogUrl ? (
          <a href={job.algorithmLogUrl} target="_blank" rel="noreferrer">
            View Log
          </a>
        ) : (
          'No logs found.'
        )}
      </ListItem>

      {job.resultsUrl?.map((url, i) =>
        url ? (
          <ListItem key={shortid.generate()}>
            <a href={url} target="_blank" rel="noreferrer">
              View Result {i}
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
      disabled={isLoading}
    >
      {isLoading ? <Loader /> : 'Get Results'}
    </Button>
  )
}
