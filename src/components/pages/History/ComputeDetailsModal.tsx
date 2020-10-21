import { Logger } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import AssetList from '../../organisms/AssetList'
import BaseDialog from '../../atoms/BaseDialog'
import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/ComputeJob'
import { ComputeJobMetaData } from '@types/ComputeJobMetaData'
import Time from '../../atoms/Time'

export default function ComputeDetailsModal({
  computeJob,
  open,
  onClose
}: {
  computeJob: ComputeJobMetaData
  open: boolean
  onClose: () => void
}): ReactElement {
  const { ocean, status, accountId } = useOcean()
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    async function getDetails() {
      if (!accountId || !ocean || !computeJob) return
      try {
        setIsLoading(true)
      } catch (error) {
        Logger.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getDetails()
  }, [ocean, status, accountId])

  return (
    <BaseDialog open={open} onClose={onClose} title="Compute job details">
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
              return <span>{url}</span>
            })}{' '}
          </p>
        </>
      )}
    </BaseDialog>
  )
}
