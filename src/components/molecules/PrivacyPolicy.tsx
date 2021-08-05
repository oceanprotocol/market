import classNames from 'classnames/bind'
import React, { ReactElement, useEffect, useState } from 'react'
import Button from '../atoms/Button'
import Time from '../atoms/Time'
import styles from '../templates/PageMarkdown.module.css'

const cx = classNames.bind(styles)

export interface PrivacyPolicyParams {
  languageLabel: string
  languageHelp: string
  tocHeader: string
  updated: string
  dateFormat: string
}

export default function PrivacyPolicy({
  tableOfContents,
  html,
  params,
  date
}: {
  tableOfContents: string
  html: string
  params: PrivacyPolicyParams
  date: string
}): ReactElement {
  const policyId = 'PrivacyPolicy'

  const [offset, setOffset] = useState(0)
  const [showToTop, setShowToTop] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onscroll = () => {
        setOffset(window.pageYOffset)
      }
      setShowToTop(
        document.getElementById(policyId).getBoundingClientRect().top -
          document.body.getBoundingClientRect().top
      )
    }
  }, [])

  return (
    <div id={policyId}>
      <p>
        {params?.updated || 'Last updated on'}{' '}
        <Time date={date} displayFormat={params?.dateFormat || 'MM-dd-yyyy'} />
      </p>
      <div className={styles.content}>
        <h1 id={policyId}>{params?.tocHeader || 'Table of Contents'}</h1>
        <div
          className={styles.tocList}
          dangerouslySetInnerHTML={{ __html: tableOfContents }}
        />
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showToTop > 0 && (
        <Button
          className={cx({ toTopBtn: true, visible: offset > showToTop })}
          to={`#${policyId}`}
          style="primary"
        >
          &#8593;
        </Button>
      )}
    </div>
  )
}
