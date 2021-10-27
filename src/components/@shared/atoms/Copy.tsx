import React, { ReactElement, useEffect, useState } from 'react'
import loadable from '@loadable/component'
import styles from './Copy.module.css'
import IconCopy from '@images/copy.svg'

// lazy load when needed only, as library is a bit big
const Clipboard = loadable(() => import('react-clipboard.js'))

export default function Copy({ text }: { text: string }): ReactElement {
  const [isCopied, setIsCopied] = useState(false)

  // Clear copy success style after 5 sec.
  useEffect(() => {
    if (!isCopied) return

    const timeout = setTimeout(() => {
      setIsCopied(false)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [isCopied])

  return (
    <Clipboard
      data-clipboard-text={text}
      button-title="Copy to clipboard"
      onSuccess={() => setIsCopied(true)}
      className={`${styles.button} ${isCopied ? styles.copied : ''}`}
    >
      <IconCopy className={styles.icon} />
    </Clipboard>
  )
}
