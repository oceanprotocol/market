import React, { ReactElement } from 'react'
import BuildId from '../atoms/BuildId'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'
import MarketStats from '../molecules/MarketStats'
import SyncStatus from '../molecules/SyncStatus'
import {
  footer,
  content,
  copyright as copyrightStyle
} from './Footer.module.css'

export default function Footer(): ReactElement {
  const { copyright } = useSiteMetadata()
  const year = new Date().getFullYear()

  return (
    <footer className={footer}>
      <div className={content}>
        <SyncStatus /> | <BuildId />
        <MarketStats />
        <div className={copyrightStyle}>
          © {year} <Markdown text={copyright} /> —{' '}
          <Link to="/terms">Terms</Link>
          {' — '}
          <a href="https://oceanprotocol.com/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
