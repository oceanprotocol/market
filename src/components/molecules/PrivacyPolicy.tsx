import React, { ReactElement } from 'react'
import Time from '../atoms/Time'
import ScrollButton from '../atoms/ScrollButton'
import styles from '../templates/PageMarkdown.module.css'

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

  const calcToTopVisible = (scrollOffset: number) => {
    const policyOffset = Math.ceil(
      document.getElementById(policyId).getBoundingClientRect().top -
        document.body.getBoundingClientRect().top
    )
    return scrollOffset > policyOffset
  }

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
      <ScrollButton
        scrollToId={policyId}
        calculateShowScrollButton={calcToTopVisible}
      >
        &#8593;
      </ScrollButton>
    </div>
  )
}
