import { Logger } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import Modal from '../../atoms/Modal'
import AssetList from '../../organisms/AssetList'
import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/ComputeJob'
import { ComputeJobMetaData } from '@types/ComputeJobMetaData'
import Time from '../../atoms/Time'
import shortid from 'shortid'

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

  useEffect(() => {
    async function getDetails() {
      if (!account || !ocean || !computeJob || !isOpen) return

      try {
        setIsLoading(true)
        const job = await ocean.compute.status(
          account,
          computeJob.did,
          computeJob.jobId
        )
        console.log(job[0])
        if (job && job.length > 0) {
          computeJob.algorithmLogUrl = job[0].algorithmLogUrl
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
  }, [ocean, status, account, open])

  return (
    <Modal
      title="Compute job details"
      isOpen={isOpen}
      onToggleModal={onToggleModal}
    >
      {isLoading ? (
        <Loader />
      ) : (
          <>
            <p>{computeJob.assetName}</p>
            <p>
              <Time date={computeJob.dateCreated} isUnix />
            </p>
            <p>
              <Time date={computeJob.dateFinished} isUnix />
            </p>
            <p>{computeJob.statusText}</p>
            <p>{computeJob.algorithmLogUrl}</p>
            <p>
              {computeJob.resultsUrls?.map((url) => {
                return <span key={shortid.generate()}>{url}</span>
              })}{' '}
            </p>
          </>
        )}
    </Modal>
  )
}
