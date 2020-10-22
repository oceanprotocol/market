import { Logger } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import Modal from '../../atoms/Modal'
import { ComputeJobMetaData } from '../../../@types/ComputeJobMetaData'
import Time from '../../atoms/Time'
import shortid from 'shortid'
import styles from './ComputeDetails.module.css'
import { Status } from './ComputeJobs'
import { ListItem } from '../../atoms/Lists'

export default function ComputeDetailsModal({
  computeJob,
  isOpen,
  onToggleModal
}: {
  computeJob: ComputeJobMetaData
  isOpen: boolean
  onToggleModal: () => void
}): ReactElement {
  const { ocean, status, account } = useOcean()
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
        if (job && job.length > 0) {
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
  }, [ocean, status, account, isOpen, computeJob, isFinished])

  return (
    <Modal
      title="Compute job details"
      isOpen={isOpen}
      onToggleModal={onToggleModal}
    >
      <h3 className={styles.title}>{computeJob.assetName}</h3>
      <p>
        Created on <Time date={computeJob.dateCreated} isUnix />
        {computeJob.dateFinished && (
          <>
            <br />
            Finished on <Time date={computeJob.dateFinished} isUnix />
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
                <a
                  href={computeJob.algorithmLogUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Log
                </a>
              </ListItem>

              {computeJob.resultsUrls?.map((url, i) => (
                <ListItem key={shortid.generate()}>
                  <a href={url} target="_blank" rel="noreferrer">
                    View Result {i}
                  </a>
                </ListItem>
              ))}
            </ul>
          </>
        ))}
    </Modal>
  )
}
