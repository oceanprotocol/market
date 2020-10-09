import { Logger } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import AssetList from '../../organisms/AssetList'
import BaseDialog from '../../atoms/BaseDialog'
import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/ComputeJob'

export default function ComputeDetailsModal({
  computeJob,
  open,
  onClose
}: {
  computeJob: ComputeJob
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
      {isLoading ? <Loader /> : <>Details</>}
    </BaseDialog>
  )
}
