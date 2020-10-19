import Alert from './Alert'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { confetti } from 'dom-confetti'
import styles from './SuccessConfetti.module.css'

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

export default function SuccessConfetti({
  success,
  action
}: {
  success: string
  action: ReactNode
}): ReactElement {
  // Have some confetti upon success
  useEffect(() => {
    if (!success || typeof window === 'undefined') return

    const startElement: HTMLElement = document.querySelector(
      'span[data-confetti]'
    )
    confetti(startElement, confettiConfig)
  }, [success])

  return (
    <>
      <Alert text={success} state="success" />
      <span className={styles.action} data-confetti>
        {action}
      </span>
    </>
  )
}
