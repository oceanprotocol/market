import React, { useState, useEffect } from 'react'
import { useOrbis } from '@context/Orbis'
import styles from './DecryptedMessage.module.css'

export default function DecryptedMessage({
  content
}: {
  content: OrbisPostContentInterface
}) {
  const { orbis } = useOrbis()
  const [loading, setLoading] = useState(true)
  const [decrypted, setDecrypted] = useState(null)

  useEffect(() => {
    const decryptMessage = async (content: OrbisPostContentInterface) => {
      if (!content?.encryptedMessage) {
        setLoading(false)
        setDecrypted(content.body)
        return
      }
      setLoading(true)
      const res = await orbis.decryptMessage(content)

      setDecrypted(res.result)
      setLoading(false)
    }
    if (content && orbis) {
      console.log(content)
      decryptMessage(content)
    }
  }, [content, orbis])

  return (
    <span className={loading && styles.decrypting}>
      {!loading ? decrypted : '---'}
    </span>
  )
}
