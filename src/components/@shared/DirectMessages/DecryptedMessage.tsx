import React, { useState, useEffect } from 'react'
import { useOrbis } from '@context/DirectMessages'
import Refresh from '@images/refresh.svg'
import styles from './DecryptedMessage.module.css'
import { IOrbisMessageContent } from '@context/DirectMessages/_types'
import { LoggerInstance } from '@oceanprotocol/lib'

export default function DecryptedMessage({
  content,
  position = 'right'
}: {
  content: IOrbisMessageContent & { decryptedMessage?: string }
  position: 'left' | 'right'
}) {
  const { orbis } = useOrbis()
  const [loading, setLoading] = useState(true)
  const [decrypted, setDecrypted] = useState(null)
  const [encryptionError, setEncryptionError] = useState<boolean>(false)

  const decryptMessage = async () => {
    setLoading(true)
    setEncryptionError(false)

    try {
      if (content?.decryptedMessage) {
        setDecrypted(content?.decryptedMessage)
      } else {
        const res = await orbis.decryptMessage({
          conversation_id: content?.conversation_id,
          encryptedMessage: content?.encryptedMessage
        })
        if (res.status === 200) {
          setEncryptionError(false)
          setDecrypted(res.result)
        } else {
          setEncryptionError(true)
          setDecrypted('Decryption error - please try later')
        }
      }
    } catch (error) {
      LoggerInstance.error(`[decryptMessage] orbis api error: `, error)
      setEncryptionError(true)
      setDecrypted('Decryption error - please try later')
    }

    setLoading(false)
  }

  useEffect(() => {
    if (content && orbis) decryptMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, orbis])

  if (loading) {
    return <span className={styles.decrypting}>---</span>
  }

  return (
    <div style={{ position: 'relative' }}>
      {!loading ? decrypted : '---'}
      {encryptionError && (
        <button
          type="button"
          className={`${styles.refresh} ${styles[position]}`}
          onClick={decryptMessage}
          title="Refresh"
        >
          <Refresh
            role="img"
            aria-label="Refresh"
            className={styles.refreshIcon}
          />
        </button>
      )}
    </div>
  )
}
