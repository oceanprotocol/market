import React from 'react'
import styles from './Footer.module.css'
import { copyright } from '../../../site.config'
import Markdown from '../atoms/Markdown'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        © {year} <Markdown text={copyright} />
      </div>
    </footer>
  )
}
