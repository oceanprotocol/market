import { Logger } from '@oceanprotocol/lib'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import Modal from '../../atoms/Modal'
import { ComputeJobMetaData } from '../../../@types/ComputeJobMetaData'
import Time from '../../atoms/Time'
import shortid from 'shortid'
import styles from './ComputeDetails.module.css'
import { Status } from './ComputeJobs'
import { ListItem } from '../../atoms/Lists'
import { useOcean } from '../../../providers/Ocean'

export default function ComputeDetailsModal({
  computeJob,
  isOpen,
  onToggleModal
}: {
  computeJob: ComputeJobMetaData
  isOpen: boolean
  onToggleModal: () => void
}): ReactElement {
  const { ocean, account } = useOcean()
  const [isLoading, setIsLoading] = useState(false)

  const isFinished = computeJob.dateFinished !== null

  useEffect(() => {
    async function getDetails() {
      if (!account || !ocean || !computeJob || !isOpen || !isFinished) return

      try {
        setIsLoading(true)
        const job = await ocean.compute.status(
          account,
          computeJob.did,
          computeJob.jobId
        )
        if (job?.length > 0) {
          computeJob.algorithmLogUrl = job[0].algorithmLogUrl
          // hack because ComputeJob returns resultsUrl instead of resultsUrls, issue created already
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
  }, [ocean, account, isOpen, computeJob, isFinished])

  return (
    <Modal
      title="Compute job details"
      isOpen={isOpen}
      onToggleModal={onToggleModal}
    >
      <h3 className={styles.title}>{computeJob.assetName}</h3>
      <p>
        Created <Time date={computeJob.dateCreated} isUnix relative />
        {computeJob.dateFinished && (
          <>
            <br />
            Finished <Time date={computeJob.dateFinished} isUnix relative />
          </>
        )}
      </p>
      <Status>{computeJob.statusText}</Status>

      {isFinished &&
        (isLoading ? (
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
        ))}
    </Modal>
  )
}
