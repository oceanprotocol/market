import React, { useEffect, useState } from 'react'
import Button from '@shared/atoms/Button'
import styles from './DmButton.module.css'
import { useAccount, useConnect } from 'wagmi'
import { useOrbis } from '@context/DirectMessages'

export default function DmButton({
  accountId,
  text = 'Send Message'
}: {
  accountId: string
  text?: string
}) {
  const { address: ownAccountId } = useAccount()
  const {
    checkOrbisConnection,
    getConversationByDid,
    setConversationId,
    setOpenConversations,
    createConversation,
    getDid
  } = useOrbis()
  const [userDid, setUserDid] = useState<string | undefined>()
  const [isCreatingConversation, setIsCreatingConversation] = useState(false)

  const handleActivation = async () => {
    if (ownAccountId) {
      await checkOrbisConnection({
        address: ownAccountId,
        autoConnect: true,
        lit: true
      })
    }
  }

  useEffect(() => {
    const getUserDid = async () => {
      const did = await getDid(accountId)
      setUserDid(did)
    }

    if (accountId) {
      getUserDid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  if (accountId !== ownAccountId && userDid) {
    return (
      <Button
        style="text"
        size="small"
        disabled={isCreatingConversation}
        onClick={async () => {
          if (!ownAccountId) {
            handleActivation()
          } else {
            setIsCreatingConversation(true)
            const conversation = await getConversationByDid(userDid)
            if (conversation) {
              setConversationId(conversation.stream_id)
            } else {
              const newConversationId = await createConversation([userDid])
              console.log(newConversationId)
              setConversationId(newConversationId)
            }
            setOpenConversations(true)
            setIsCreatingConversation(false)
          }
        }}
      >
        {isCreatingConversation ? 'Loading...' : text}
      </Button>
    )
  }
}
