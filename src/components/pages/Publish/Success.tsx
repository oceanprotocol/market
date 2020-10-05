import Alert from '../../atoms/Alert'
import Button from '../../atoms/Button'
import React, { ReactElement, useEffect } from 'react'
import { confetti } from 'dom-confetti'
import styles from './Success.module.css'

const confettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: '10px',
  height: '10px',
  perspective: '500px',
  colors: [
    'var(--brand-pink)',
    'var(--brand-purple)',
    'var(--brand-violet)',
    'var(--brand-grey-light)',
    'var(--brand-grey-lighter)'
  ]
}

export default function Success({
  success,
  did
}: {
  success: string
  did: string
}): ReactElement {
  // Have some confetti upon success
  useEffect(() => {
    if (!success || typeof window === 'undefined') return

    const startElement: HTMLElement = document.querySelector('a[data-confetti]')
    confetti(startElement, confettiConfig)
  }, [success])

  return (
    <>
      <Alert text={success} state="success" />
      <Button
        style="primary"
        size="small"
        href={`/asset/${did}`}
        className={styles.action}
        data-confetti
      >
        Go to data set →
      </Button>
    </>
  )
}
