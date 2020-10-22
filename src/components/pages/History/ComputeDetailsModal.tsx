import { Logger } from '@oceanprotocol/lib'
import { useOcean } from '@oceanprotocol/react'
import React, { ReactElement, useEffect, useState } from 'react'
import Loader from '../../atoms/Loader'
import Modal from '../../atoms/Modal'
import AssetList from '../../organisms/AssetList'
import { ComputeJob } from '@oceanprotocol/lib/dist/node/ocean/interfaces/ComputeJob'

export default function ComputeDetailsModal({
  computeJob,
  isOpen,
  onToggleModal
}: {
  computeJob: ComputeJob
  isOpen: boolean
  onToggleModal: () => void
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
  }, [ocean, status, accountId, computeJob])

  return (
    <Modal
      title="Compute job details"
      isOpen={isOpen}
      onToggleModal={onToggleModal}
    >
      {isLoading ? <Loader /> : 'Details'}
    </Modal>
  )
}
