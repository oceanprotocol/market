import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../../atoms/Loader'
import { ComputeJobMetaData } from '../../../../@types/ComputeJobMetaData'
import shortid from 'shortid'
import { ListItem } from '../../../atoms/Lists'
import { useOcean } from '../../../../providers/Ocean'
import styles from './Results.module.css'

export default function Results({
  computeJob
}: {
  computeJob: ComputeJobMetaData
}): ReactElement {
  const { ocean, account } = useOcean()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function getDetails() {
      if (!account || !ocean || !computeJob) return

      try {
        setIsLoading(true)
        const job = await ocean.compute.status(
          account,
          computeJob.did,
          undefined,
          undefined,
          computeJob.jobId
        )
        if (job?.length > 0) {
          computeJob.algorithmLogUrl = job[0].algorithmLogUrl
          // TODO: hack because ComputeJob returns resultsUrl instead of resultsUrls, issue created already
          computeJob.resultsUrls =
            (job[0] as any).resultsUrl !== '' ? (job[0] as any).resultsUrl : []
        }
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getDetails()
  }, [ocean, account, computeJob])

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <ul>
        <ListItem>
          {computeJob.algorithmLogUrl ? (
            <a
              href={computeJob.algorithmLogUrl}
              target="_blank"
              rel="noreferrer"
            >
              View Log
            </a>
          ) : (
            'No logs found'
          )}
        </ListItem>

        {computeJob.resultsUrls?.map((url, i) =>
          url ? (
            <ListItem key={shortid.generate()}>
              <a href={url} target="_blank" rel="noreferrer">
                View Result {i}
              </a>
            </ListItem>
          ) : (
            'No results found.'
          )
        )}
      </ul>
    </>
  )
}
