import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import MarketStats from '../molecules/MarketStats'
import repoMetadata from '../../../repo-metadata.json'

export default function Footer(): ReactElement {
  const { copyright } = useSiteMetadata()
  const year = new Date().getFullYear()

  const commitBranch = repoMetadata.branch
  const commitId = repoMetadata.commit
  const isMainBranch = commitBranch === 'main'

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <a
          className={styles.commitId}
          href={`https://github.com/oceanprotocol/market/tree/${
            isMainBranch ? commitId : commitBranch
          }`}
          target="_blank"
          rel="noreferrer"
        >
          {isMainBranch ? commitId.substring(0, 7) : commitBranch}
        </a>
        <MarketStats />© {year} <Markdown text={copyright} /> —{' '}
        <Link to="/terms">Terms</Link>
        {' — '}
        <a href="https://oceanprotocol.com/privacy">Privacy</a>
      </div>
    </footer>
  )
}
