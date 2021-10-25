import React, { ReactElement } from 'react'
import Time from '@shared/atoms/Time'
import styles from '@shared/Page/PageMarkdown.module.css'
import { usePrivacyMetadata } from '@hooks/usePrivacyMetadata'
import PrivacyLanguages from './PrivacyLanguages'

export default function PrivacyPolicyHeader({
  tableOfContents,
  policy
}: {
  tableOfContents?: string
  policy: string
}): ReactElement {
  const { policies } = usePrivacyMetadata()
  const policyMetadata = policies.find((p) => p.policy === policy)
  const { date, params } = policyMetadata

  return (
    <div>
      <PrivacyLanguages label={params.languageLabel} />
      <p>
        {params?.updated || 'Last updated on'}{' '}
        <Time date={date} displayFormat={params?.dateFormat || 'MM-dd-yyyy'} />
      </p>
      <div className={styles.content}>
        <h1>{params?.tocHeader || 'Table of Contents'}</h1>
        <div
          className={styles.tocList}
          dangerouslySetInnerHTML={{ __html: tableOfContents }}
        />
      </div>
    </div>
  )
}
