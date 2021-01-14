import React, { ReactElement, useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import styles from './PageHeader.module.css'
import { ca } from 'date-fns/esm/locale'

const cx = classNames.bind(styles)

export default function PageHeader({
  title,
  description,
  center
}: {
  title: string
  description?: string
  center?: boolean
}): ReactElement {
  const styleClasses = cx({
    header: true,
    center: center
  })

  const [fontSize, setFontSize] = useState('')
  const [lineHeight, setLineHeight] = useState('')
  const [isTitleLong, setIsTitleLong] = useState(false)

  const setFontSizeAndLineHeight = (
    fontSize: number,
    linesNumber: number,
    lineHeight: number
  ) => {
    if (linesNumber > 3) {
      linesNumber += 4
      fontSize -= linesNumber
      lineHeight -= linesNumber
      setFontSize(fontSize + 'px')
      setLineHeight(lineHeight + 'px')
      setIsTitleLong(true)
    }
  }

  const countLines = (element: any) => {
    const elementHeight = element.offsetHeight
    const lineHeight = parseInt(
      document.defaultView
        .getComputedStyle(element, null)
        .getPropertyValue('line-height')
    )
    const lines: number = elementHeight / lineHeight
    return { linesNumber: lines, lineHeight: lineHeight }
  }

  useEffect(() => {
    const titleElement = document.querySelector(
      'h1[class*=PageHeader-module--title]'
    )
    console.log(titleElement)
    /* const titleElement = document.getElementsByClassName(
      'PageHeader-module--title--2n3-e'
    )[0] */
    const lines = countLines(titleElement)
    const currentFontSize = parseInt(
      document.defaultView
        .getComputedStyle(titleElement, null)
        .getPropertyValue('font-size')
    )
    setFontSizeAndLineHeight(
      currentFontSize,
      lines.linesNumber,
      lines.lineHeight
    )
  }, [])

  return (
    <header className={styleClasses}>
      <h1
        className={styles.title}
        style={
          isTitleLong ? { fontVariationSettings: '"wght" 0, "wdth" 0' } : {}
        }
      >
        {title}
      </h1>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  )
}
