import React, { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import { Link } from 'gatsby'

export default function Footer(): ReactElement {
  const { copyright } = useSiteMetadata()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        © {year} <Markdown text={copyright} /> — <Link to="/terms">Terms</Link>
        {' — '}
        <a href="https://oceanprotocol.com/privacy">Privacy</a>
      </div>
    </footer>
  )
}
