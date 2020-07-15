import React, { useState, useEffect } from 'react'
import { useNavigate } from '@reach/router'
import { DDO } from '@oceanprotocol/lib'
import { redeploy } from '../../utils'
import Button from '../atoms/Button'
import BaseDialog from '../atoms/BaseDialog'
import { useOcean } from '@oceanprotocol/react'

const content = [
  'You are about to delete your Data Set.',
  'Your Data Set is being deleted...',
  'You have deleted your Data Set ',
  'Something happened... Your Data Set cannot be deleted'
]

export default function DeleteAction({ ddo }: { ddo: DDO }) {
  const { ocean, accountId } = useOcean()
  const navigate = useNavigate()
  const isOwner = ddo.publicKey[0].owner === accountId
  const [isModal, setIsModal] = useState(false)
  const [status, setStatus] = useState(0) // 0-confirmation, 1-deleting, 2-success, 3-error
  const { attributes } = ddo.findServiceByType('metadata')

  useEffect(() => {
    let tId: number
    if (status === 2) {
      tId = window.setTimeout(() => {
        navigate(`/`)
      }, 1000)
    }
    return () => {
      clearTimeout(tId)
    }
  }, [status])
  if (!accountId || !ocean || !isOwner) return null
  async function handleDeleteAction() {
    if (!ocean) return

    setStatus(1)
    setIsModal(true)
    try {
      const consumerAddress = (await ocean.accounts.list())[0]
      await ocean.assets.retire(ddo.id, consumerAddress)

      // trigger new live deployment
      await redeploy()

      setStatus(2)
    } catch (error) {
      // TODO: handle error
      console.log(error)
      setStatus(3)
    }
  }

  const handleCancel = () => {
    setIsModal(false)
    setStatus(0)
  }

  const handleOpenConfirmation = () => setIsModal(true)

  return (
    <>
      <Button onClick={handleOpenConfirmation}>Delete</Button>

      <BaseDialog
        title={`Delete ${attributes.main.name}`}
        open={isModal}
        onClose={() => setIsModal(false)}
      >
        {content[status]}
        <footer>
          <Button onClick={handleDeleteAction}>Confirm</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </footer>
      </BaseDialog>
    </>
  )
}
