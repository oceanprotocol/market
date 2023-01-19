import React, { useRef, useState, useMemo, KeyboardEvent } from 'react'
import styles from './Postbox.module.css'
import { useOrbis } from '@context/Orbis'
import SendIcon from '@images/send.svg'
import { accountTruncate } from '@utils/web3'
import { didToAddress, sleep } from '@utils/orbis'

export default function Postbox({
  replyTo = null,
  isCreatingConvo,
  setIsCreatingConvo,
  cancelReplyTo,
  callback
}: {
  replyTo?: IOrbisMessage
  isCreatingConvo: boolean
  setIsCreatingConvo: (isCreatingConvo: boolean) => void
  cancelReplyTo?: () => void
  callback: (value: IOrbisMessage) => void
}) {
  const [isSending, setIsSending] = useState<boolean>(false)

  const postBoxArea = useRef(null)
  const {
    orbis,
    account,
    conversationId,
    newConversation,
    createConversation,
    setConversationId,
    setNewConversation
  } = useOrbis()

  const isDisabled = useMemo(() => {
    if (!conversationId || isSending || isCreatingConvo) {
      return true
    }

    return false
  }, [conversationId, isSending, isCreatingConvo])

  const share = async () => {
    if (!account || isSending || postBoxArea.current.innerText.trim() === '')
      return false

    setIsSending(true)

    const body = postBoxArea.current.innerText.trim()
    postBoxArea.current.innerText = ''

    let _conversationId = conversationId
    if (_conversationId.startsWith('new-') && newConversation) {
      setIsCreatingConvo(true)
      const _newConversation = await createConversation(
        newConversation.recipients
      )
      if (_newConversation) {
        _conversationId = _newConversation.stream_id
        setConversationId(_conversationId)
        setNewConversation(null)
        await sleep(1000)
      }
      setIsCreatingConvo(false)
    }

    const content: IOrbisMessageContent & { decryptedMessage?: string } = {
      encryptedMessage: null,
      decryptedMessage: body,
      master: replyTo ? replyTo.master || replyTo.stream_id : undefined,
      reply_to: replyTo ? replyTo.stream_id : undefined
    }

    const timestamp = Math.floor(Date.now() / 1000)

    const _callbackContent: IOrbisMessage = {
      conversation_id: conversationId,
      content,
      creator: account.did,
      creator_details: {
        did: account.did,
        profile: account.details?.profile,
        metadata: account.details?.metadata
      },
      master: replyTo ? replyTo.master || replyTo.stream_id : null,
      reply_to: replyTo ? replyTo.stream_id : null,
      reply_to_creator_details: replyTo ? replyTo.creator_details : null,
      reply_to_details: replyTo ? replyTo.content : null,
      stream_id: 'new_post--' + timestamp,
      timestamp
    }

    if (callback) callback(_callbackContent)

    const res = await orbis.sendMessage({
      conversation_id: _conversationId,
      body
    })

    if (res.status === 200) {
      _callbackContent.stream_id = res.doc
      if (callback) callback(_callbackContent)
    }

    setIsSending(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.key) return

    if (isSending && isCreatingConvo) {
      e.preventDefault()
    }
  }

  return (
    <div className={styles.postbox}>
      {replyTo && (
        <div className={styles.replyto}>
          <div className={styles.replytoDetails}>
            Replying to{' '}
            <strong>
              {replyTo?.creator_details?.metadata?.ensName ||
                accountTruncate(didToAddress(replyTo?.creator_details?.did))}
            </strong>
          </div>
          <button className={styles.replytoCancel} onClick={cancelReplyTo}>
            &times;
          </button>
        </div>
      )}
      <div className={styles.postboxInput}>
        <div
          id="postbox-area"
          ref={postBoxArea}
          className={styles.editable}
          contentEditable={true}
          data-placeholder="Type your message here..."
          onKeyDown={handleKeyDown}
          style={{
            pointerEvents: isSending || isCreatingConvo ? 'none' : 'auto'
          }}
        />
        <button
          type="button"
          className={styles.sendButton}
          onClick={share}
          disabled={isDisabled}
        >
          <SendIcon className={styles.icon} />
        </button>
      </div>
    </div>
  )
}
