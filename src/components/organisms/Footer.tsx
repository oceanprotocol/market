import React from 'react'
import styles from './Footer.module.css'
import Markdown from '../atoms/Markdown'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

export default function Footer() {
  const { copyright } = useSiteMetadata()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        © {year} <Markdown text={copyright} />
      </div>
    </footer>
  )
}
