import React, { ReactElement } from 'react'
import repoMetadata from '../../../content/repo-metadata.json'
import styles from './BuildId.module.css'

export default function BuildId(): ReactElement {
  const commitBranch = repoMetadata.branch
  const commitId = repoMetadata.commit
  const isMainBranch = commitBranch === 'main'

  return (
    <a
      className={styles.buildId}
      href={`https://github.com/oceanprotocol/market/tree/${
        isMainBranch ? commitId : commitBranch
      }`}
      target="_blank"
      rel="noreferrer"
      title="Build ID referring to the linked commit hash."
    >
      {isMainBranch ? commitId.substring(0, 7) : commitBranch}
    </a>
  )
}
