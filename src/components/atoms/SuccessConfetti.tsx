import Alert from './Alert'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { confetti } from 'dom-confetti'
import { action as actionStyle } from './SuccessConfetti.module.css'

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
  action,
  className
}: {
  success: string
  action?: ReactNode
  className?: string
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
    <div className={className || null}>
      <Alert text={success} state="success" />
      <span className={actionStyle} data-confetti>
        {action}
      </span>
    </div>
  )
}
