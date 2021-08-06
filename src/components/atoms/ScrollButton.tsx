import classNames from 'classnames/bind'
import React, { ReactElement, useEffect, useState, useRef } from 'react'
import { ReactNode } from 'react-markdown'
import Button, { ButtonProps } from './Button'
import styles from './ScrollButton.module.css'
import debounce from 'lodash.debounce'

const cx = classNames.bind(styles)

export default function ScrollButton({
  scrollToId,
  calculateShowScrollButton,
  children,
  style,
  delay
}: {
  scrollToId: string
  calculateShowScrollButton: (offset: number) => boolean
  children: ReactNode
  style?: ButtonProps['style']
  delay?: number
}): ReactElement {
  const [offset, setOffset] = useState(0)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const debouncedCalc = debounce((offset: number) => {
    setShowScrollButton(calculateShowScrollButton(offset))
  }, delay || 100)

  const refDebounced = useRef(debouncedCalc)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onscroll = () => {
        setOffset(window.pageYOffset)
      }
    }
  }, [])

  useEffect(() => {
    refDebounced.current(offset)
  }, [offset])

  return (
    <Button
      className={cx({ scrollButton: true, visible: showScrollButton })}
      to={`#${scrollToId}`}
      style={style || 'primary'}
    >
      {children}
    </Button>
  )
}
