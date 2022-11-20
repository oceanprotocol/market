import React, { useState, useEffect } from 'react'
import { useOrbis } from '@context/Orbis'
import styles from './DecryptedMessage.module.css'

export default function DecryptedMessage({
  content
}: {
  content: IOrbisMessageContent & { decryptedMessage?: string }
}) {
  const { orbis } = useOrbis()
  const [loading, setLoading] = useState(true)
  const [decrypted, setDecrypted] = useState(null)

  useEffect(() => {
    const decryptMessage = async () => {
      setLoading(true)

      if (content?.decryptedMessage) {
        setDecrypted(content?.decryptedMessage)
      } else {
        const res = await orbis.decryptMessage({
          conversation_id: content?.conversation_id,
          encryptedMessage: content?.encryptedMessage
        })
        setDecrypted(res.result)
      }
      setLoading(false)
    }

    if (content && orbis) {
      decryptMessage()
    }
  }, [content, orbis])

  return (
    <span className={loading && styles.decrypting}>
      {!loading ? decrypted : '---'}
    </span>
  )
}
