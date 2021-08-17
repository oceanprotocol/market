import React, { ReactElement } from 'react'
import Time from '../atoms/Time'
import styles from '../templates/PageMarkdown.module.css'

export interface PrivacyPolicyParams {
  languageLabel: string
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
    </div>
  )
}
