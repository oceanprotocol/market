import React, { ReactElement } from 'react'
import styles from './PrivacyLanguages.module.css'
import { usePrivacyMetadata } from '@hooks/usePrivacyMetadata'
import { useUserPreferences } from '@context/UserPreferences'
import Link from 'next/link'

export default function PrivacyLanguages({
  label
}: {
  label?: string
}): ReactElement {
  const { policies } = usePrivacyMetadata()
  const { setPrivacyPolicySlug } = useUserPreferences()

  return (
    <div className={styles.langSelect}>
      <span className={styles.langLabel}>{label || 'Language'}</span>
      <div className={styles.langOptions}>
        {policies.map((policy, i) => {
          const slug = `/privacy/${policy.policy}`
          return (
            <React.Fragment key={policy.policy}>
              {i > 0 && ' — '}
              <Link
                href={slug}
                onClick={() => {
                  setPrivacyPolicySlug(slug)
                }}
              >
                {policy.language}
              </Link>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
